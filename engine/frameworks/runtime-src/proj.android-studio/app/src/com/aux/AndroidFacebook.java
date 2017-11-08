package com.aux;

import org.cocos2dx.lib.Cocos2dxActivity;
import org.cocos2dx.lib.Cocos2dxGLSurfaceView;

import android.app.Activity;
import android.content.Context;
import android.os.Bundle;
import android.content.Intent;
import android.view.WindowManager;
import android.view.Display;
import android.provider.Settings.Secure;

import com.facebook.FacebookSdk;
import com.facebook.appevents.AppEventsLogger;
import com.facebook.CallbackManager;
import com.facebook.FacebookCallback;
import com.facebook.FacebookException;
import com.facebook.AccessToken;
import com.facebook.login.LoginManager;
import com.facebook.login.LoginResult;
import com.facebook.share.model.GameRequestContent;
import com.facebook.share.widget.GameRequestDialog;
import com.facebook.GraphRequest;
import com.facebook.GraphResponse;
import com.facebook.HttpMethod;

import org.json.JSONArray;
import org.json.JSONObject;
import java.util.Arrays;
import java.util.List;
import java.util.ListIterator;
import java.util.HashMap;

import android.util.Log;

public class AndroidFacebook {	
    private static GameRequestDialog requestDialog;
    private static CallbackManager callbackManager;
    private static JSONObject emptyAuthResponse;

    public static boolean isInitialized() {
        return FacebookSdk.isInitialized();
    }

    public static void getLoginStatus() {        
        ((Activity)Cocos2dxActivity.getContext()).runOnUiThread(new Runnable() {
            @Override
            public void run() {
                AccessToken accessToken = AccessToken.getCurrentAccessToken();
                if (accessToken != null) {
                    JSONObject o = new JSONObject();
                    JSONObject a = new JSONObject();

                    try {
                        a.put("accessToken", accessToken.getToken());
                        a.put("userID", accessToken.getUserId());
                        a.put("expiresIn", (int)(accessToken.getExpires().getTime() / 1000));

                        o.put("status", "connected");
                        o.put("authResponse", a);
                    } catch (Exception ex) {                        
                    }

                    onJniFacebookResult(o.toString());
                } else {
                    JSONObject o = new JSONObject();

                    try {
                        o.put("status", "unknown");
                        o.put("authResponse", emptyAuthResponse);                    
                    } catch (Exception ex) {                        
                    }

                    onJniFacebookResult(o.toString());
                }                
            }
        });        
    }

    public static void login(HashMap<String, String> params) {        
        final String[] permissions = params.get("scope").split(",");
        ((Activity)Cocos2dxActivity.getContext()).runOnUiThread(new Runnable() {
            @Override
            public void run() {
                LoginManager.getInstance().logInWithReadPermissions((Activity)Cocos2dxActivity.getContext(), Arrays.asList(permissions));
            }
        });        
    }

    public static void logout() {        
        ((Activity)Cocos2dxActivity.getContext()).runOnUiThread(new Runnable() {
            @Override
            public void run() {
                LoginManager.getInstance().logOut();    

                JSONObject o = new JSONObject();
                try {
                    o.put("status", "not_authorized");
                    o.put("authResponse", emptyAuthResponse);           
                } catch (Exception ex) {                        
                }
                onJniFacebookResult(o.toString());            
            }
        });        
    }

    public static void openGameRequestDialog(final String message) {
        ((Activity)Cocos2dxActivity.getContext()).runOnUiThread(new Runnable() {
            @Override
            public void run() {
                GameRequestContent content = new GameRequestContent.Builder()
                    .setMessage(message)
                    .build();
            requestDialog.show(content);
            }
        });
    }

    public static void api(final String path, final String method, HashMap<String, String> params) {
        final HashMap<String, String> fparams = new HashMap<String, String>(params);

        ((Activity)Cocos2dxActivity.getContext()).runOnUiThread(new Runnable() {
            @Override
            public void run() {
                HttpMethod httpMethod = HttpMethod.GET;
                if (method.equals("post")) {
                    httpMethod = HttpMethod.POST;
                } else if (method.equals("delete")) {
                    httpMethod = HttpMethod.DELETE;
                }

                Bundle parameters = new Bundle();
                for (HashMap.Entry<String, String> entry : fparams.entrySet()) {
                    parameters.putString(entry.getKey(), entry.getValue());
                }

                GraphRequest request = new GraphRequest(
                    AccessToken.getCurrentAccessToken(),
                    path,
                    parameters,
                    httpMethod,
                    new GraphRequest.Callback() {
                        @Override
                        public void onCompleted(GraphResponse response) {
                            onJniFacebookResult(response.getRawResponse());
                        }
                    });
                
                request.executeAsync();
            }
        });
    }

    public static void register(Activity activity) {
        FacebookSdk.sdkInitialize(activity.getApplicationContext());
        AppEventsLogger.activateApp(activity);    

        callbackManager = CallbackManager.Factory.create();

        requestDialog = new GameRequestDialog(activity);
        requestDialog.registerCallback(callbackManager,
            new FacebookCallback<GameRequestDialog.Result>() {
                public void onSuccess(GameRequestDialog.Result result) {
                    String id = result.getRequestId();
                    List<String> recipients = result.getRequestRecipients();

                    JSONObject o = new JSONObject();

                    try {
                        o.put("request", id);
                        o.put("to", new JSONArray(recipients));
                    } catch (Exception ex) {                        
                    }

                    onJniFacebookResult(o.toString());
                }

                public void onCancel() {
                    JSONObject o = new JSONObject();

                    try {
                        o.put("request", "");
                    } catch (Exception ex) {                        
                    }

                    onJniFacebookResult(o.toString());
                }

                public void onError(FacebookException error) {
                    JSONObject o = new JSONObject();

                    try {
                        o.put("request", "");
                    } catch (Exception ex) {                        
                    }

                    onJniFacebookResult(o.toString());
                }
            }
        );

        LoginManager.getInstance().registerCallback(callbackManager,
            new FacebookCallback<LoginResult>() {
                @Override
                public void onSuccess(LoginResult loginResult) {
                    AccessToken accessToken = loginResult.getAccessToken();

                    JSONObject o = new JSONObject();
                    JSONObject a = new JSONObject();

                    try {
                        a.put("accessToken", accessToken.getToken());
                        a.put("userID", accessToken.getUserId());
                        a.put("expiresIn", (int)(accessToken.getExpires().getTime() / 1000));

                        o.put("status", "connected");
                        o.put("authResponse", a);
                    } catch (Exception ex) {                        
                    }

                    onJniFacebookResult(o.toString());
                }

                @Override
                public void onCancel() {
                    JSONObject o = new JSONObject();
                    try {
                        o.put("status", "not_authorized");
                        o.put("authResponse", emptyAuthResponse);           
                    } catch (Exception ex) {                        
                    }
                    onJniFacebookResult(o.toString());
                }

                @Override
                public void onError(FacebookException exception) {
                    JSONObject o = new JSONObject();
                    try {
                        o.put("status", exception.getMessage());
                        o.put("authResponse", emptyAuthResponse);           
                    } catch (Exception ex) {                        
                    }
                    onJniFacebookResult(o.toString());
                }
        });

        JSONObject a = new JSONObject();
        try {
            a.put("accessToken", "");
            a.put("userID", "");
            a.put("expiresIn", 0);
        } catch (Exception ex) {                        
        }

        emptyAuthResponse = a;
    }

    public static void onActivityResult(final int requestCode, final int resultCode, final Intent data) {
        callbackManager.onActivityResult(requestCode, resultCode, data);
    }

    public static native void onJniFacebookResult(String jsonResponse);
}
