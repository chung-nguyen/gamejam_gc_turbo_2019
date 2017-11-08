#include <string>
#include <sstream>

#include "base/CCDirector.h"
#include "base/CCScheduler.h"

#include "scripting/js-bindings/manual/extension/jsb_analytics.h"
#include "extensions/cocos-ext.h"
#include "scripting/js-bindings/manual/ScriptingCore.h"
#include "scripting/js-bindings/manual/cocos2d_specifics.hpp"
#include "scripting/js-bindings/auto/jsb_cocos2dx_auto.hpp"
#include <thread>

USING_NS_CC;
USING_NS_CC_EXT;

bool js_analytics_set_user_id(JSContext* ctx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);

    std::string userId;
    bool ok = jsval_to_std_string(ctx, args.get(0), &userId);
    JSB_PRECONDITION2(ok, ctx, false, "js_analytics_set_user_id : Error processing arguments");

    nativeAnalyticsSetUserId(userId);       
    return true;
}

bool js_analytics_set_user_property(JSContext* ctx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);

    std::string key;
    bool ok = jsval_to_std_string(ctx, args.get(0), &key);
    JSB_PRECONDITION2(ok, ctx, false, "js_analytics_set_user_property : Error processing arguments");

    std::string val;
    ok = jsval_to_std_string(ctx, args.get(1), &val);
    JSB_PRECONDITION2(ok, ctx, false, "js_analytics_set_user_property : Error processing arguments");

    nativeAnalyticsSetUserProperty(key, val);       
    return true;
}

bool js_analytics_set_current_screen(JSContext* ctx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);

    std::string name;
    bool ok = jsval_to_std_string(ctx, args.get(0), &name);
    JSB_PRECONDITION2(ok, ctx, false, "js_analytics_set_current_screen : Error processing arguments");

    std::string className;
    ok = jsval_to_std_string(ctx, args.get(1), &className);
    JSB_PRECONDITION2(ok, ctx, false, "js_analytics_set_current_screen : Error processing arguments");

    nativeAnalyticsSetCurrentScreen(name, className);       
    return true;
}

bool js_analytics_log_event(JSContext* ctx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);

    std::string eventName;
    bool ok = jsval_to_std_string(ctx, args.get(0), &eventName);
    JSB_PRECONDITION2(ok, ctx, false, "js_analytics_log_event : Error processing arguments");

    std::map<std::string, std::string> params;
    ok = jsval_to_std_map_string_string(ctx, args.get(1), &params);    
    JSB_PRECONDITION2(ok, ctx, false, "js_analytics_log_event : Error processing arguments");
    
    nativeAnalyticsLogEvent(eventName, params);       
    return true;
}

void register_analytics(JSContext* cx, JS::HandleObject global)
{
    JS::RootedObject jsbObj(cx);
    get_or_create_js_obj(cx, global, "analytics", &jsbObj);

    JS_DefineFunction(cx, jsbObj, "setUserId", js_analytics_set_user_id, 1, JSPROP_READONLY | JSPROP_PERMANENT);
    JS_DefineFunction(cx, jsbObj, "setUserProperty", js_analytics_set_user_property, 2, JSPROP_READONLY | JSPROP_PERMANENT);
    JS_DefineFunction(cx, jsbObj, "setCurrentScreen", js_analytics_set_current_screen, 2, JSPROP_READONLY | JSPROP_PERMANENT);
    JS_DefineFunction(cx, jsbObj, "logEvent", js_analytics_log_event, 2, JSPROP_READONLY | JSPROP_PERMANENT);    
}
