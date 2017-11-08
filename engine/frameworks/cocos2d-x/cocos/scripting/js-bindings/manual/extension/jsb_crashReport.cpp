#include <string>
#include <sstream>

#include "base/CCDirector.h"
#include "base/CCScheduler.h"

#include "scripting/js-bindings/manual/extension/jsb_crashReport.h"
#include "extensions/cocos-ext.h"
#include "scripting/js-bindings/manual/ScriptingCore.h"
#include "scripting/js-bindings/manual/cocos2d_specifics.hpp"
#include "scripting/js-bindings/auto/jsb_cocos2dx_auto.hpp"
#include <thread>

USING_NS_CC;
USING_NS_CC_EXT;

bool js_crashReport_report(JSContext* ctx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);

    std::string message;
    bool ok = jsval_to_std_string(ctx, args.get(0), &message);
    JSB_PRECONDITION2(ok, ctx, false, "js_crashReport_report : Error processing arguments");

    nativeCrashReport(message);       
    return true;
}

bool js_crashReport_log(JSContext* ctx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);

    std::string message;
    bool ok = jsval_to_std_string(ctx, args.get(0), &message);
    JSB_PRECONDITION2(ok, ctx, false, "js_crashReport_log : Error processing arguments");

    nativeCrashLog(message);       
    return true;
}

bool js_crashReport_logcat(JSContext* ctx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);

    std::string message;
    bool ok = jsval_to_std_string(ctx, args.get(0), &message);
    JSB_PRECONDITION2(ok, ctx, false, "js_crashReport_logcat : Error processing arguments");

    nativeCrashLogcat(message);       
    return true;
}

void register_crashReport(JSContext* cx, JS::HandleObject global)
{
    JS::RootedObject jsbObj(cx);
    get_or_create_js_obj(cx, global, "crashReport", &jsbObj);

    JS_DefineFunction(cx, jsbObj, "report", js_crashReport_report, 1, JSPROP_READONLY | JSPROP_PERMANENT);
    JS_DefineFunction(cx, jsbObj, "log", js_crashReport_log, 1, JSPROP_READONLY | JSPROP_PERMANENT);
    JS_DefineFunction(cx, jsbObj, "logcat", js_crashReport_logcat, 1, JSPROP_READONLY | JSPROP_PERMANENT);
}
