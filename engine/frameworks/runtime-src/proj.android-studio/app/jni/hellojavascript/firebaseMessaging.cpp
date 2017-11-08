#include <string>
#include <queue>

#include "AppDelegate.h"
#include "cocos2d.h"
#include "platform/android/jni/JniHelper.h"
#include <jni.h>
#include <android/log.h>

using namespace cocos2d;

#define JAVA_PACKAGE_NAME "com/aux"
#define ANDROID_FCM_PACKAGE_NAME "com/aux/MyFirebaseMessaging"

struct FCMNotification 
{
    std::string jsonData;
};

std::queue<FCMNotification> _fcmNotificationQueue;

bool nativeFCMPopNotification(std::string& os, std::string& jsonData) 
{    
    if (!_fcmNotificationQueue.empty()) {
        const FCMNotification& msg = _fcmNotificationQueue.front();
        os = "android";
        jsonData = msg.jsonData;

        _fcmNotificationQueue.pop();
        return true;
    }    

    return false;
}

void nativeFCMSetGameShowingNotification(bool value)
{
    JniMethodInfo methodInfo;    

    if (!JniHelper::getStaticMethodInfo(methodInfo, ANDROID_FCM_PACKAGE_NAME, "setGameShowingNotification", "(Z)V")) {
        return;
    }

    methodInfo.env->CallStaticVoidMethod(methodInfo.classID, methodInfo.methodID, value ? JNI_TRUE : JNI_FALSE);
    methodInfo.env->DeleteLocalRef(methodInfo.classID); 
}

std::string nativeFCMGetToken()
{
    JniMethodInfo methodInfo;    

    if (!JniHelper::getStaticMethodInfo(methodInfo, ANDROID_FCM_PACKAGE_NAME, "getToken", "()Ljava/lang/String;")) {
        return "";
    }

    jstring str = (jstring)methodInfo.env->CallStaticObjectMethod(methodInfo.classID, methodInfo.methodID);
    std::string res = JniHelper::jstring2string(str);
    methodInfo.env->DeleteLocalRef(str);
    methodInfo.env->DeleteLocalRef(methodInfo.classID); 
    return res;
}

void nativeFCMSubscribe(std::string topic) 
{
    JniMethodInfo methodInfo;    

    if (!JniHelper::getStaticMethodInfo(methodInfo, ANDROID_FCM_PACKAGE_NAME, "subscribeToTopic", "(Ljava/lang/String;)V")) {
        return;
    }

    jstring jtopic = methodInfo.env->NewStringUTF(topic.c_str());
    methodInfo.env->CallStaticVoidMethod(methodInfo.classID, methodInfo.methodID, jtopic);
    methodInfo.env->DeleteLocalRef(jtopic);
    methodInfo.env->DeleteLocalRef(methodInfo.classID); 
}

void nativeFCMUnsubscribe(std::string topic) 
{
    JniMethodInfo methodInfo;    

    if (!JniHelper::getStaticMethodInfo(methodInfo, ANDROID_FCM_PACKAGE_NAME, "unsubscribeFromTopic", "(Ljava/lang/String;)V")) {
        return;
    }

    jstring jtopic = methodInfo.env->NewStringUTF(topic.c_str());
    methodInfo.env->CallStaticVoidMethod(methodInfo.classID, methodInfo.methodID, jtopic);
    methodInfo.env->DeleteLocalRef(jtopic);
    methodInfo.env->DeleteLocalRef(methodInfo.classID); 
}

extern "C" {
    JNIEXPORT jboolean JNICALL Java_com_gamebai_MyFirebaseMessaging_onJniFCMNotification(JNIEnv* env, jclass klass, jstring jsonData) 
    {
        FCMNotification msg;        
        msg.jsonData = JniHelper::jstring2string(jsonData);

        _fcmNotificationQueue.push(msg);        
        return JNI_TRUE;
    }
}