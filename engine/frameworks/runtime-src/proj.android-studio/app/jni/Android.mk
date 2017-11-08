LOCAL_PATH := $(call my-dir)

include $(CLEAR_VARS)

LOCAL_MODULE := cocos2djs_shared

LOCAL_MODULE_FILENAME := libcocos2djs

LOCAL_SRC_FILES := hellojavascript/main.cpp \
				   hellojavascript/nativeDevice.cpp \
                   hellojavascript/facebook.cpp \
                   hellojavascript/firebaseMessaging.cpp \
                   hellojavascript/analytics.cpp \
                   hellojavascript/crashReport.cpp \
                   hellojavascript/iab.cpp \
                   hellojavascript/utils.cpp \
                   ../../../Classes/AppDelegate.cpp 

LOCAL_C_INCLUDES := $(LOCAL_PATH)/../../../Classes $(LOCAL_PATH)/hellojavascript

LOCAL_STATIC_LIBRARIES := cocos2d_js_static

LOCAL_EXPORT_CFLAGS := -DCOCOS2D_DEBUG=2 -DCOCOS2D_JAVASCRIPT

include $(BUILD_SHARED_LIBRARY)


$(call import-module, scripting/js-bindings/proj.android)
