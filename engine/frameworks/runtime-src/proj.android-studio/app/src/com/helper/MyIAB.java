package com.helper;

import org.cocos2dx.goldfish.R;
import org.cocos2dx.lib.Cocos2dxActivity;

import android.app.Activity;
import android.content.Intent;
import android.util.Log;

import com.helper.iabhelper.IabHelper;
import com.helper.iabhelper.IabResult;
import com.helper.iabhelper.Inventory;
import com.helper.iabhelper.Purchase;

import java.util.List;
import java.util.LinkedList;

public class MyIAB
{
    private final static String TAG = Utils.LOG_TAG;

    private static IabHelper mHelper;

    private static LinkedList<Purchase> mPurchaseList = new LinkedList<Purchase>();

    public static void launchPurchaseFlow(final String sku, final int requestCode, final String payload) {
        if (mHelper != null) {
            ((Activity)Cocos2dxActivity.getContext()).runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    mHelper.launchPurchaseFlow((Activity)Cocos2dxActivity.getContext(), sku, requestCode, mPurchaseFinishedListener, payload);
                }
            });
        }        
    }

    public static void launchSubscriptionPurchaseFlow(final String sku, final int requestCode, final String payload) {
        if (mHelper != null) {
            ((Activity)Cocos2dxActivity.getContext()).runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    mHelper.launchSubscriptionPurchaseFlow((Activity)Cocos2dxActivity.getContext(), sku, requestCode, mPurchaseFinishedListener, payload);
                }
            });
        }
    }

    public static boolean subscriptionsSupported() {
        return mHelper != null ? mHelper.subscriptionsSupported() : false;
    }

    public static void consume(final String jsonData) {
        ((Activity)Cocos2dxActivity.getContext()).runOnUiThread(new Runnable() {
            @Override
            public void run() {
                try {
                    Purchase purchase = new Purchase(jsonData);
                    mHelper.consumeAsync(purchase, mConsumeFinishedListener);
                } catch (Exception e) {                    
                }
            }
        });
    }

    public static String getPurchaseJson() {
        Purchase purchase = mPurchaseList.getFirst();
        return purchase.getJsonData();
    }

    public static void popPurchase() {
        Purchase purchase = mPurchaseList.removeFirst();
        mHelper.consumeAsync(purchase, mConsumeFinishedListener);
    }

    public static void register(Activity activity) {
        String base64EncodedPublicKey = activity.getResources().getString(R.string.google_play_iap_key);

        // Create the helper, passing it our context and the public key to verify signatures with
        mHelper = new IabHelper(activity, base64EncodedPublicKey);

        // enable debug logging (for a production application, you should set this to false).
        mHelper.enableDebugLogging(false);

        // Start setup. This is asynchronous and the specified listener
        // will be called once setup completes.
        mHelper.startSetup(new IabHelper.OnIabSetupFinishedListener() {
            public void onIabSetupFinished(IabResult result) {
                if (!result.isSuccess()) {
                    // Oh noes, there was a problem.
                    MyFirebaseCrash.log("Problem setting up in-app billing: " + result);
                    onJniIABError("init", result.getResponse());                
                    return;
                }

                // Have we been disposed of in the meantime? If so, quit.
                if (mHelper == null) return;

                // IAB is fully set up. Now, let's get an inventory of stuff we own.
                mHelper.queryInventoryAsync(mGotInventoryListener);
            }
        });   
    }

    public static boolean onActivityResult(final int requestCode, final int resultCode, final Intent data) {
        if (mHelper != null) {
            return mHelper.handleActivityResult(requestCode, resultCode, data);
        }        

        return false;
    }

    public static void onDestroy() {
        if (mHelper != null) {
            mHelper.dispose();
            mHelper = null;
        }
    }

    // Listener that's called when we finish querying the items and subscriptions we own
    private static IabHelper.QueryInventoryFinishedListener mGotInventoryListener = new IabHelper.QueryInventoryFinishedListener() {
        public void onQueryInventoryFinished(IabResult result, Inventory inventory) {
            Log.d(TAG, "Query inventory finished.");

            // Have we been disposed of in the meantime? If so, quit.
            if (mHelper == null) return;

            // Is it a failure?
            if (result.isFailure()) {
                MyFirebaseCrash.log("Failed to query inventory: " + result);
                onJniIABError("inventory", result.getResponse());
                return;
            }

            List<Purchase> purchases = inventory.getAllPurchases();
            for (Purchase purchase : purchases) {
                if (verifyDeveloperPayload(purchase)) {
                    pushPurchase(purchase);
                } else {
                    MyFirebaseCrash.log("Error purchasing. Authenticity verification failed.");
                    onJniIABError("verify", 0);
                }                
            }            
        }
    };

    // Callback for when a purchase is finished
    private static IabHelper.OnIabPurchaseFinishedListener mPurchaseFinishedListener = new IabHelper.OnIabPurchaseFinishedListener() {
        public void onIabPurchaseFinished(IabResult result, Purchase purchase) {
            Log.d(TAG, "Consumption finished. Purchase: " + purchase + ", result: " + result);

            // if we were disposed of in the meantime, quit.
            if (mHelper == null) return;

            if (result.isFailure()) {
                MyFirebaseCrash.log("Error purchasing: " + result);
                onJniIABError("purchase", result.getResponse());
                return;
            }
            if (!verifyDeveloperPayload(purchase)) {
                MyFirebaseCrash.log("Error purchasing. Authenticity verification failed.");
                onJniIABError("verify", 0);
                return;
            }

            Log.d(TAG, "Purchase successful.");
            pushPurchase(purchase);
        }
    };

    // Called when consumption is complete
    private static IabHelper.OnConsumeFinishedListener mConsumeFinishedListener = new IabHelper.OnConsumeFinishedListener() {
        public void onConsumeFinished(Purchase purchase, IabResult result) {
            Log.d(TAG, "Consumption finished. Purchase: " + purchase + ", result: " + result);

            // if we were disposed of in the meantime, quit.
            if (mHelper == null) return;

            // We know this is the "gas" sku because it's the only one we consume,
            // so we don't check which sku was consumed. If you have more than one
            // sku, you probably should check...
            if (result.isSuccess()) {
                // successfully consumed, so we apply the effects of the item in our
                // game world's logic, which in our case means filling the gas tank a bit
                Log.d(TAG, "Consumption successful. Provisioning.");
            }
            else {
                MyFirebaseCrash.log("Error while consuming: " + result);
                onJniIABError("consume", result.getResponse());
            }
            
            Log.d(TAG, "End consumption flow.");
        }
    };

    /** Verifies the developer payload of a purchase. */
    private static boolean verifyDeveloperPayload(Purchase p) {
        String payload = p.getDeveloperPayload();

        /*
         * TODO: verify that the developer payload of the purchase is correct. It will be
         * the same one that you sent when initiating the purchase.
         *
         * WARNING: Locally generating a random string when starting a purchase and
         * verifying it here might seem like a good approach, but this will fail in the
         * case where the user purchases an item on one device and then uses your app on
         * a different device, because on the other device you will not have access to the
         * random string you originally generated.
         *
         * So a good developer payload has these characteristics:
         *
         * 1. If two different users purchase an item, the payload is different between them,
         *    so that one user's purchase can't be replayed to another user.
         *
         * 2. The payload must be such that you can verify it even when the app wasn't the
         *    one who initiated the purchase flow (so that items purchased by the user on
         *    one device work on other devices owned by the user).
         *
         * Using your own server to store and verify developer payloads across app
         * installations is recommended.
         */

        return true;
    }

    private static void pushPurchase(Purchase purchase) {
        mPurchaseList.add(purchase);
    }

    public static native void onJniIABError(String reason, int code);    
}