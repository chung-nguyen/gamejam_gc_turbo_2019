#include "utils.h"

#include <android/log.h>

#define JAVA_PACKAGE_NAME "com/aux"
#define ANDROID_IAB_PACKAGE_NAME "com/aux/MyIAB"

void nativeIABLaunchPurchaseFlow(std::string sku, int requestCode, std::string payload) 
{
    JniMethodInfo methodInfo;    

    if (!JniHelper::getStaticMethodInfo(methodInfo, ANDROID_IAB_PACKAGE_NAME, "launchPurchaseFlow", "(Ljava/lang/String;ILjava/lang/String;)V")) {
        return;
    }

    jint jrequestCode = (jint)requestCode;
    jstring jsku = methodInfo.env->NewStringUTF(sku.c_str());    
    jstring jpayload = methodInfo.env->NewStringUTF(payload.c_str());
    methodInfo.env->CallStaticVoidMethod(methodInfo.classID, methodInfo.methodID, jsku, jrequestCode, jpayload);
    methodInfo.env->DeleteLocalRef(jsku);
    methodInfo.env->DeleteLocalRef(jpayload);
    methodInfo.env->DeleteLocalRef(methodInfo.classID); 
}

void nativeIABLaunchSubscriptionPurchaseFlow(std::string sku, int requestCode, std::string payload) 
{
    JniMethodInfo methodInfo;    

    if (!JniHelper::getStaticMethodInfo(methodInfo, ANDROID_IAB_PACKAGE_NAME, "launchSubscriptionPurchaseFlow", "(Ljava/lang/String;ILjava/lang/String;)V")) {
        return;
    }

    jint jrequestCode = (jint)requestCode;
    jstring jsku = methodInfo.env->NewStringUTF(sku.c_str());    
    jstring jpayload = methodInfo.env->NewStringUTF(payload.c_str());
    methodInfo.env->CallStaticVoidMethod(methodInfo.classID, methodInfo.methodID, jsku, jrequestCode, jpayload);
    methodInfo.env->DeleteLocalRef(jsku);
    methodInfo.env->DeleteLocalRef(jpayload);
    methodInfo.env->DeleteLocalRef(methodInfo.classID); 
}

bool nativeIABSubscriptionsSupported() 
{
    JniMethodInfo methodInfo;    

    if (!JniHelper::getStaticMethodInfo(methodInfo, ANDROID_IAB_PACKAGE_NAME, "subscriptionsSupported", "()Z")) {
        return false;
    }

    jboolean result = methodInfo.env->CallStaticBooleanMethod(methodInfo.classID, methodInfo.methodID);
    return result == JNI_TRUE;
}

void nativeIABConsume(std::string jsonData) 
{
    JniMethodInfo methodInfo;    

    if (!JniHelper::getStaticMethodInfo(methodInfo, ANDROID_IAB_PACKAGE_NAME, "consume", "(Ljava/lang/String;)V")) {
        return;
    }

    jstring jjsonData = methodInfo.env->NewStringUTF(jsonData.c_str());    
    methodInfo.env->CallStaticVoidMethod(methodInfo.classID, methodInfo.methodID, jjsonData);
    methodInfo.env->DeleteLocalRef(jjsonData);
    methodInfo.env->DeleteLocalRef(methodInfo.classID); 
}

std::string nativeIABGetPurchaseJson()
{
    JniMethodInfo methodInfo;    

    if (!JniHelper::getStaticMethodInfo(methodInfo, ANDROID_IAB_PACKAGE_NAME, "getPurchaseJson", "()Ljava/lang/String;")) {
        return "";
    }

    jstring str = (jstring)methodInfo.env->CallStaticObjectMethod(methodInfo.classID, methodInfo.methodID);
    std::string res = JniHelper::jstring2string(str);
    methodInfo.env->DeleteLocalRef(str);
    methodInfo.env->DeleteLocalRef(methodInfo.classID); 
    return res;
}

void nativeIABPopPurchase()
{
    JniMethodInfo methodInfo;    

    if (!JniHelper::getStaticMethodInfo(methodInfo, ANDROID_IAB_PACKAGE_NAME, "popPurchase", "()V")) {
        return;
    }

    methodInfo.env->CallStaticVoidMethod(methodInfo.classID, methodInfo.methodID);
    methodInfo.env->DeleteLocalRef(methodInfo.classID); 
}

extern "C" {
    JNIEXPORT void JNICALL Java_com_gamebai_MyIAB_onJniIABError(JNIEnv* env, jclass klass, jstring jreason, jint jcode) 
    {        
    }
}
