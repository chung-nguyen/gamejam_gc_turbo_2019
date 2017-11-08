#include "AppDelegate.h"
#include "cocos2d.h"
#include "platform/android/jni/JniHelper.h"
#include <jni.h>
#include <android/log.h>

using namespace cocos2d;

#define JAVA_PACKAGE_NAME "com/aux"
#define NATIVE_DEVICE_PACKAGE_NAME "com/aux/NativeDevice"

std::string nativeGetDeviceID()
{
    JniMethodInfo methodInfo;

    if (!JniHelper::getStaticMethodInfo(methodInfo, NATIVE_DEVICE_PACKAGE_NAME, "getDeviceID", "()Ljava/lang/String;")) {
        return "failed";
    }

    jstring str = (jstring)methodInfo.env->CallStaticObjectMethod(methodInfo.classID, methodInfo.methodID);
    std::string res = JniHelper::jstring2string(str);
    methodInfo.env->DeleteLocalRef(str);
    methodInfo.env->DeleteLocalRef(methodInfo.classID);    
    return res;
}

void nativeCopyClipboard(std::string content)
{    
    JniMethodInfo methodInfo;    

    if (!JniHelper::getStaticMethodInfo(methodInfo, NATIVE_DEVICE_PACKAGE_NAME, "copyClipboard", "(Ljava/lang/String;)V")) {
        return;
    }

    jstring jcontent = methodInfo.env->NewStringUTF(content.c_str());
    methodInfo.env->CallStaticVoidMethod(methodInfo.classID, methodInfo.methodID, jcontent);
    methodInfo.env->DeleteLocalRef(jcontent);
    methodInfo.env->DeleteLocalRef(methodInfo.classID); 
}

void nativeOpenSMSApp(std::string to, std::string body)
{
    JniMethodInfo methodInfo;    

    if (!JniHelper::getStaticMethodInfo(methodInfo, NATIVE_DEVICE_PACKAGE_NAME, "openSMSApp", "(Ljava/lang/String;Ljava/lang/String;)V")) {
        return;
    }

    jstring jto = methodInfo.env->NewStringUTF(to.c_str());
    jstring jbody = methodInfo.env->NewStringUTF(body.c_str());
    methodInfo.env->CallStaticVoidMethod(methodInfo.classID, methodInfo.methodID, jto, jbody);
    methodInfo.env->DeleteLocalRef(jto);
    methodInfo.env->DeleteLocalRef(jbody);
    methodInfo.env->DeleteLocalRef(methodInfo.classID); 
}
