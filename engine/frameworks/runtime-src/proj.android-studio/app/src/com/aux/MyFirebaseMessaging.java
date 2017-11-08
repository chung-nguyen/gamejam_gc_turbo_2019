package com.aux;

import org.cocos2dx.douchebag.R;

import org.cocos2dx.lib.Cocos2dxActivity;
import android.app.Activity;

import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.BroadcastReceiver;
import android.media.RingtoneManager;
import android.net.Uri;
import android.support.v4.app.NotificationCompat;
import android.util.Log;

import org.cocos2dx.javascript.AppActivity;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.iid.FirebaseInstanceId;
import com.google.firebase.messaging.RemoteMessage;

import org.json.JSONObject;
import java.util.Map;
import java.util.List;
import java.util.ArrayList;

public class MyFirebaseMessaging {

    private static boolean isGameShowingNotification = false;

    public static void setGameShowingNotification(boolean value) {
        isGameShowingNotification = value;
    }

    public static String getToken() {
        String token = FirebaseInstanceId.getInstance().getToken();
        return token != null ? token : "";
    }

    public static void subscribeToTopic(final String topic) {
        ((Activity)Cocos2dxActivity.getContext()).runOnUiThread(new Runnable() {
            @Override
            public void run() {
                FirebaseMessaging.getInstance().subscribeToTopic(topic);
            }
        });
    }

    public static void unsubscribeFromTopic(final String topic) {
        ((Activity)Cocos2dxActivity.getContext()).runOnUiThread(new Runnable() {
            @Override
            public void run() {
                FirebaseMessaging.getInstance().unsubscribeFromTopic(topic);
            }
        });
    }

    public static void registerMessageHandler(final Activity activity) {
        IntentFilter intentFilter = new IntentFilter("com.aux.ReceiveNotification");

        activity.registerReceiver(new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                RemoteMessage message = intent.getParcelableExtra("data");                
                RemoteMessage.Notification notification = message.getNotification();

                if (notification != null) {                    
                    String title = notification.getTitle();
                    String body = notification.getBody();

                    if (!isGameShowingNotification) {
                        sendLocalNotification(activity, title, body);
                    }
                }

                if (isGameShowingNotification) {
                    Map<String, String> data = message.getData();
                    JSONObject jsonObj;

                    if (data != null) {
                        jsonObj = new JSONObject(data);
                    } else {
                        jsonObj = new JSONObject();
                    }

                    if (notification != null) {
                        JSONObject jsonNotification = new JSONObject();
                        
                        try {
                            jsonNotification.put("body", notification.getBody());
                            jsonNotification.put("color", notification.getColor());
                            jsonNotification.put("icon", notification.getIcon());
                            jsonNotification.put("sound", notification.getSound());
                            jsonNotification.put("tag", notification.getTag());
                            jsonNotification.put("title", notification.getTitle());

                            jsonObj.put("notification", jsonNotification);
                        } catch (Exception ex) {                            
                        }
                    }

                    onJniFCMNotification(jsonObj.toString());
                }                
            }
        }, intentFilter);
    }

    public static native boolean onJniFCMNotification(String jsonData);

    public static void sendLocalNotification(Activity activity, String title, String messageBody) {
        Intent intent = new Intent(activity, AppActivity.class);
        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
        PendingIntent pendingIntent = PendingIntent.getActivity(activity, 0 /* Request code */, intent,
                PendingIntent.FLAG_ONE_SHOT);

        Uri defaultSoundUri= RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);
        NotificationCompat.Builder notificationBuilder = new NotificationCompat.Builder(activity)
                .setSmallIcon(R.drawable.ic_stat_ic_notification)
                .setContentTitle(title)
                .setContentText(messageBody)
                .setAutoCancel(true)
                .setSound(defaultSoundUri)
                .setContentIntent(pendingIntent);

        NotificationManager notificationManager =
                (NotificationManager) activity.getSystemService(Context.NOTIFICATION_SERVICE);

        notificationManager.notify(0 /* ID of notification */, notificationBuilder.build());
    }
}
