#include <string>
#include "utils.h"

#include "AppDelegate.h"
#include "cocos2d.h"
#include "platform/android/jni/JniHelper.h"
#include <jni.h>
#include <android/log.h>

using namespace cocos2d;

#define JAVA_PACKAGE_NAME "com/aux"
#define ANDROID_FACEBOOK_PACKAGE_NAME "com/aux/AndroidFacebook"

typedef void (*FacebookCallbackFunction)(std::string);

FacebookCallbackFunction facebookCallbackFunction = NULL;

bool nativeFacebookIsInitialized()
{
    JniMethodInfo methodInfo;    

    if (!JniHelper::getStaticMethodInfo(methodInfo, ANDROID_FACEBOOK_PACKAGE_NAME, "isInitialized", "()Z")) {
        return false;
    }

    bool res = (bool)methodInfo.env->CallStaticBooleanMethod(methodInfo.classID, methodInfo.methodID);
    methodInfo.env->DeleteLocalRef(methodInfo.classID); 

    return res;
}

void nativeFacebookGetLoginStatus(FacebookCallbackFunction cb)
{
    JniMethodInfo methodInfo;    

    facebookCallbackFunction = cb;

    if (!JniHelper::getStaticMethodInfo(methodInfo, ANDROID_FACEBOOK_PACKAGE_NAME, "getLoginStatus", "()V")) {
        return;
    }

    methodInfo.env->CallStaticVoidMethod(methodInfo.classID, methodInfo.methodID);
    methodInfo.env->DeleteLocalRef(methodInfo.classID); 
}

void nativeFacebookLogin(FacebookCallbackFunction cb, std::map<std::string, std::string> params)
{
    JniMethodInfo methodInfo;    

    facebookCallbackFunction = cb;

    if (!JniHelper::getStaticMethodInfo(methodInfo, ANDROID_FACEBOOK_PACKAGE_NAME, "login", "(Ljava/util/HashMap;)V")) {
        return;
    }

    jobject jparams = createJavaMapObject(&params);        
    methodInfo.env->CallStaticVoidMethod(methodInfo.classID, methodInfo.methodID, jparams);
    methodInfo.env->DeleteLocalRef(jparams);
    methodInfo.env->DeleteLocalRef(methodInfo.classID); 
}

void nativeFacebookLogout(FacebookCallbackFunction cb)
{
    JniMethodInfo methodInfo;    

    facebookCallbackFunction = cb;

    if (!JniHelper::getStaticMethodInfo(methodInfo, ANDROID_FACEBOOK_PACKAGE_NAME, "logout", "()V")) {
        return;
    }

    methodInfo.env->CallStaticVoidMethod(methodInfo.classID, methodInfo.methodID);
    methodInfo.env->DeleteLocalRef(methodInfo.classID); 
}

void nativeFacebookGameRequestDialog(std::string message, FacebookCallbackFunction cb)
{
    JniMethodInfo methodInfo;    

    facebookCallbackFunction = cb;

    if (!JniHelper::getStaticMethodInfo(methodInfo, ANDROID_FACEBOOK_PACKAGE_NAME, "openGameRequestDialog", "(Ljava/lang/String;)V")) {
        return;
    }

    jstring jmessage = methodInfo.env->NewStringUTF(message.c_str());
    methodInfo.env->CallStaticVoidMethod(methodInfo.classID, methodInfo.methodID, jmessage);
    methodInfo.env->DeleteLocalRef(jmessage);
    methodInfo.env->DeleteLocalRef(methodInfo.classID); 
}

void nativeFacebookAPI(std::string path, std::string method, std::map<std::string, std::string> params, FacebookCallbackFunction cb)
{
    JniMethodInfo methodInfo;    

    facebookCallbackFunction = cb;

    if (!JniHelper::getStaticMethodInfo(methodInfo, ANDROID_FACEBOOK_PACKAGE_NAME, "api", "(Ljava/lang/String;Ljava/lang/String;Ljava/util/HashMap;)V")) {
        return;
    }

    jstring jpath = methodInfo.env->NewStringUTF(path.c_str());
    jstring jmethod = methodInfo.env->NewStringUTF(method.c_str());
    jobject jparams = createJavaMapObject(&params);
    methodInfo.env->CallStaticVoidMethod(methodInfo.classID, methodInfo.methodID, jpath, jmethod, jparams);
    methodInfo.env->DeleteLocalRef(jpath);
    methodInfo.env->DeleteLocalRef(jmethod);
    methodInfo.env->DeleteLocalRef(jparams);
    methodInfo.env->DeleteLocalRef(methodInfo.classID); 
}

extern "C" {
    JNIEXPORT void JNICALL Java_com_gamebai_AndroidFacebook_onJniFacebookResult(JNIEnv *env, jclass klass, jstring jsonResponse) {
        if (facebookCallbackFunction) {
            std::string strJsonResponse = JniHelper::jstring2string(jsonResponse);
            facebookCallbackFunction(strJsonResponse);
        }        
    }
}
