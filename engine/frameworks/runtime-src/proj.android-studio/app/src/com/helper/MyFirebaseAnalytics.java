package com.helper;

import org.cocos2dx.lib.Cocos2dxActivity;
import android.app.Activity;
import android.os.Bundle;
import java.util.HashMap;

import android.util.Log;
import com.google.firebase.analytics.FirebaseAnalytics;

public class MyFirebaseAnalytics {
    private static FirebaseAnalytics mFirebaseAnalytics;
    private static Activity mActivity;

    public static void register(Activity activity) {
        mActivity = activity;
        mFirebaseAnalytics = FirebaseAnalytics.getInstance(activity);
    }

    public static void setUserId(final String userId) {
        ((Activity)Cocos2dxActivity.getContext()).runOnUiThread(new Runnable() {
            @Override
            public void run() {
                mFirebaseAnalytics.setUserId(userId);
            }
        });
    }

    public static void setUserProperty(final String key, final String value) {
        ((Activity)Cocos2dxActivity.getContext()).runOnUiThread(new Runnable() {
            @Override
            public void run() {
                mFirebaseAnalytics.setUserProperty(key, value);
            }
        });
    }

    public static void setCurrentScreen(final String name, final String className) {
        ((Activity)Cocos2dxActivity.getContext()).runOnUiThread(new Runnable() {
            @Override
            public void run() {
                mFirebaseAnalytics.setCurrentScreen(mActivity, name, className);
            }
        });
    }

    public static void logEvent(final String eventName, HashMap<String, String> params) {
        final HashMap<String, String> fparams = new HashMap<String, String>(params);
        ((Activity)Cocos2dxActivity.getContext()).runOnUiThread(new Runnable() {
            @Override
            public void run() {
                Bundle bundle = new Bundle();
                for (HashMap.Entry<String, String> entry : fparams.entrySet()) {
                    bundle.putString(entry.getKey(), entry.getValue());
                }

                Log.i(Utils.LOG_TAG, "logEvent " + eventName);
                mFirebaseAnalytics.logEvent(eventName, bundle);
            }
        });
    }
}
