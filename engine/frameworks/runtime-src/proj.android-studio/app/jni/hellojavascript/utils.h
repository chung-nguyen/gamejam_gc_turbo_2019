#ifndef _jni_utils_h__
#define _jni_utils_h__

#include <string>
#include <queue>

#include "AppDelegate.h"
#include "cocos2d.h"
#include "platform/android/jni/JniHelper.h"
#include <jni.h>

using namespace cocos2d;

jobject createJavaMapObject(std::map<std::string, std::string>* paramMap);

#endif // _jni_utils_h__
