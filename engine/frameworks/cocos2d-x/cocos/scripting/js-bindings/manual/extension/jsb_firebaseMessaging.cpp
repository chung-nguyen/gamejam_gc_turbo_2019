#include <string>
#include <sstream>

#include "base/CCDirector.h"
#include "base/CCScheduler.h"

#include "scripting/js-bindings/manual/extension/jsb_firebaseMessaging.h"
#include "extensions/cocos-ext.h"
#include "scripting/js-bindings/manual/ScriptingCore.h"
#include "scripting/js-bindings/manual/cocos2d_specifics.hpp"
#include "scripting/js-bindings/auto/jsb_cocos2dx_auto.hpp"
#include <thread>

USING_NS_CC;
USING_NS_CC_EXT;

bool js_fcm_getToken(JSContext* ctx, uint32_t argc, jsval *vp)
{
    std::string res = nativeFCMGetToken();

    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    args.rval().set(std_string_to_jsval(ctx, res));
    return true;
}

bool js_fcm_set_game_showing_notification(JSContext* ctx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);

    bool value = JS::ToBoolean(args.get(0));
    nativeFCMSetGameShowingNotification(value);       
    return true;
}

bool js_fcm_subscribe(JSContext* ctx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);

    std::string topic;
    bool ok = jsval_to_std_string(ctx, args.get(0), &topic);
    JSB_PRECONDITION2(ok, ctx, false, "js_fcm_subscribe : Error processing arguments");

    nativeFCMSubscribe(topic);       
    return true;
}

bool js_fcm_unsubscribe(JSContext* ctx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);

    std::string topic;
    bool ok = jsval_to_std_string(ctx, args.get(0), &topic);
    JSB_PRECONDITION2(ok, ctx, false, "js_fcm_unsubscribe : Error processing arguments");

    nativeFCMUnsubscribe(topic);       
    return true;
}

bool js_fcm_pop_notification(JSContext* ctx, uint32_t argc, jsval *vp)
{
    std::string os;
    std::string jsonData;
    bool hasNotification = nativeFCMPopNotification(os, jsonData);     

    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);

    if (hasNotification)
    {
        JS::RootedObject jsResponse(ctx, JS_NewObject(ctx, NULL, JS::NullPtr(), JS::NullPtr()));
        JS_SetProperty(ctx, jsResponse, "os", JS::RootedValue(ctx,  std_string_to_jsval(ctx, os)));

        JS::RootedValue outVal(ctx);
        jsval strVal = std_string_to_jsval(ctx, jsonData);
        JS::RootedString jsstr(ctx, strVal.toString());
        bool ok = JS_ParseJSON(ctx, jsstr, &outVal);
        if (ok)
        {
            JS_SetProperty(ctx, jsResponse, "data", outVal);
        }        
        
        args.rval().set(OBJECT_TO_JSVAL(jsResponse));
    } else {
        args.rval().setUndefined();
    }
    
    return true;
}

void register_firebaseMessaging(JSContext* cx, JS::HandleObject global)
{
    JS::RootedObject jsbObj(cx);
    get_or_create_js_obj(cx, global, "firebaseMessaging", &jsbObj);

    JS_DefineFunction(cx, jsbObj, "getToken", js_fcm_getToken, 0, JSPROP_READONLY | JSPROP_PERMANENT);
    JS_DefineFunction(cx, jsbObj, "subscribe", js_fcm_subscribe, 1, JSPROP_READONLY | JSPROP_PERMANENT);
    JS_DefineFunction(cx, jsbObj, "unsubscribe", js_fcm_unsubscribe, 1, JSPROP_READONLY | JSPROP_PERMANENT);
    JS_DefineFunction(cx, jsbObj, "popNotification", js_fcm_pop_notification, 0, JSPROP_READONLY | JSPROP_PERMANENT);
    JS_DefineFunction(cx, jsbObj, "setGameShowingNotification", js_fcm_set_game_showing_notification, 1, JSPROP_READONLY | JSPROP_PERMANENT);    
}
