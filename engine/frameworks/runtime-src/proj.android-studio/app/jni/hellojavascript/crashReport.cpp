#include "utils.h"

#include <android/log.h>

#define JAVA_PACKAGE_NAME "com/aux"
#define ANDROID_CRASHREPORT_PACKAGE_NAME "com/aux/MyFirebaseCrash"

void nativeCrashReport(std::string message)
{
    JniMethodInfo methodInfo;    

    if (!JniHelper::getStaticMethodInfo(methodInfo, ANDROID_CRASHREPORT_PACKAGE_NAME, "report", "(Ljava/lang/String;)V")) {
        return;
    }

    jstring jmessage = methodInfo.env->NewStringUTF(message.c_str());
    methodInfo.env->CallStaticVoidMethod(methodInfo.classID, methodInfo.methodID, jmessage);
    methodInfo.env->DeleteLocalRef(jmessage);
    methodInfo.env->DeleteLocalRef(methodInfo.classID); 
}

void nativeCrashLog(std::string message)
{
    JniMethodInfo methodInfo;    

    if (!JniHelper::getStaticMethodInfo(methodInfo, ANDROID_CRASHREPORT_PACKAGE_NAME, "log", "(Ljava/lang/String;)V")) {
        return;
    }

    jstring jmessage = methodInfo.env->NewStringUTF(message.c_str());
    methodInfo.env->CallStaticVoidMethod(methodInfo.classID, methodInfo.methodID, jmessage);
    methodInfo.env->DeleteLocalRef(jmessage);
    methodInfo.env->DeleteLocalRef(methodInfo.classID); 
}

void nativeCrashLogcat(std::string message)
{
    JniMethodInfo methodInfo;    

    if (!JniHelper::getStaticMethodInfo(methodInfo, ANDROID_CRASHREPORT_PACKAGE_NAME, "logcat", "(Ljava/lang/String;)V")) {
        return;
    }

    jstring jmessage = methodInfo.env->NewStringUTF(message.c_str());
    methodInfo.env->CallStaticVoidMethod(methodInfo.classID, methodInfo.methodID, jmessage);
    methodInfo.env->DeleteLocalRef(jmessage);
    methodInfo.env->DeleteLocalRef(methodInfo.classID); 
}