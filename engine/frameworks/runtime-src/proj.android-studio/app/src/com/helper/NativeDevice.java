package com.helper;

import org.cocos2dx.lib.Cocos2dxActivity;
import org.cocos2dx.lib.Cocos2dxGLSurfaceView;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.view.WindowManager;
import android.view.Display;
import android.provider.Settings.Secure;

import android.content.ClipboardManager;
import android.content.ClipData;

import android.util.Log;

public class NativeDevice {	
    public static String getDeviceID() {
        Context context = Cocos2dxActivity.getContext();
        WindowManager window = (WindowManager) context.getSystemService(Context.WINDOW_SERVICE); 
        Display display = window.getDefaultDisplay();
        int screenWidth = display.getWidth();
        int screenHeight = display.getHeight();

        String androidId = Secure.getString(context.getContentResolver(), Secure.ANDROID_ID);
        return "android:" + screenWidth + ":" + screenHeight + ":" + androidId;
    }

    public static void copyClipboard(final String content) {
        ((Activity)Cocos2dxActivity.getContext()).runOnUiThread(new Runnable() {
            @Override
            public void run() {
                Context context = Cocos2dxActivity.getContext();
                ClipboardManager clipboard = (ClipboardManager) context.getSystemService(Context.CLIPBOARD_SERVICE); 
                ClipData clip = ClipData.newPlainText("sms", content);
                clipboard.setPrimaryClip(clip);
            }
        });
    }

    public static void openSMSApp(final String to, final String body) {
        final Activity context = (Activity)Cocos2dxActivity.getContext();
        context.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                Intent smsIntent = new Intent(android.content.Intent.ACTION_VIEW);
                smsIntent.setType("vnd.android-dir/mms-sms");
                smsIntent.putExtra("address", to);         
                smsIntent.putExtra("sms_body", body);
                context.startActivity(smsIntent);
            }
        });
    }
}
