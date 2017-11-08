#include "utils.h"

#include <android/log.h>

#define JAVA_PACKAGE_NAME "com/aux"
#define ANDROID_ANALYTICS_PACKAGE_NAME "com/aux/MyFirebaseAnalytics"

void nativeAnalyticsSetUserId(std::string userId)
{
    JniMethodInfo methodInfo;    

    if (!JniHelper::getStaticMethodInfo(methodInfo, ANDROID_ANALYTICS_PACKAGE_NAME, "setUserId", "(Ljava/lang/String;)V")) {
        return;
    }

    jstring juserId = methodInfo.env->NewStringUTF(userId.c_str());
    methodInfo.env->CallStaticVoidMethod(methodInfo.classID, methodInfo.methodID, juserId);
    methodInfo.env->DeleteLocalRef(juserId);
    methodInfo.env->DeleteLocalRef(methodInfo.classID); 
}

void nativeAnalyticsSetUserProperty(std::string key, std::string val)
{
    JniMethodInfo methodInfo;    

    if (!JniHelper::getStaticMethodInfo(methodInfo, ANDROID_ANALYTICS_PACKAGE_NAME, "setUserProperty", "(Ljava/lang/String;Ljava/lang/String;)V")) {
        return;
    }

    jstring jkey = methodInfo.env->NewStringUTF(key.c_str());
    jstring jval = methodInfo.env->NewStringUTF(val.c_str());
    methodInfo.env->CallStaticVoidMethod(methodInfo.classID, methodInfo.methodID, jkey, jval);
    methodInfo.env->DeleteLocalRef(jkey);
    methodInfo.env->DeleteLocalRef(jval);
    methodInfo.env->DeleteLocalRef(methodInfo.classID); 
}

void nativeAnalyticsSetCurrentScreen(std::string name, std::string className)
{
    JniMethodInfo methodInfo;    

    if (!JniHelper::getStaticMethodInfo(methodInfo, ANDROID_ANALYTICS_PACKAGE_NAME, "setCurrentScreen", "(Ljava/lang/String;Ljava/lang/String;)V")) {
        return;
    }

    jstring jname = methodInfo.env->NewStringUTF(name.c_str());
    jstring jclassName = methodInfo.env->NewStringUTF(className.c_str());
    methodInfo.env->CallStaticVoidMethod(methodInfo.classID, methodInfo.methodID, jname, jclassName);
    methodInfo.env->DeleteLocalRef(jname);
    methodInfo.env->DeleteLocalRef(jclassName);
    methodInfo.env->DeleteLocalRef(methodInfo.classID); 
}

void nativeAnalyticsLogEvent(std::string eventName, std::map<std::string, std::string> params)
{
    JniMethodInfo methodInfo;

    if (!JniHelper::getStaticMethodInfo(methodInfo, ANDROID_ANALYTICS_PACKAGE_NAME, "logEvent", "(Ljava/lang/String;Ljava/util/HashMap;)V")) {
        return;
    }

    jstring jeventName = methodInfo.env->NewStringUTF(eventName.c_str());
    jobject jparams = createJavaMapObject(&params);
    methodInfo.env->CallStaticVoidMethod(methodInfo.classID, methodInfo.methodID, jeventName, jparams);
    methodInfo.env->DeleteLocalRef(jeventName);
    methodInfo.env->DeleteLocalRef(jparams);
    methodInfo.env->DeleteLocalRef(methodInfo.classID); 
}
