package com.aux;

import org.cocos2dx.lib.Cocos2dxActivity;
import android.app.Activity;
import android.os.Bundle;
import java.util.HashMap;

import android.util.Log;
import com.google.firebase.crash.FirebaseCrash;

public class MyFirebaseCrash {
    public static void report(String message) {
        FirebaseCrash.report(new Exception(message));
    }

    public static void log(String message) {
        FirebaseCrash.log(message);
    }

    public static void logcat(String message) {
        FirebaseCrash.logcat(Log.DEBUG, Utils.LOG_TAG, message);        
    }
}
