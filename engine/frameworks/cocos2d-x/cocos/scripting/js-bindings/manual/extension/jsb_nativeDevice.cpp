#include <sstream>

#include "scripting/js-bindings/manual/extension/jsb_nativeDevice.h"
#include "extensions/cocos-ext.h"
#include "scripting/js-bindings/manual/ScriptingCore.h"
#include "scripting/js-bindings/manual/cocos2d_specifics.hpp"
#include "scripting/js-bindings/auto/jsb_cocos2dx_auto.hpp"
#include <thread>

USING_NS_CC;
USING_NS_CC_EXT;

bool js_native_device_get_id(JSContext* ctx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    std::string str = nativeGetDeviceID();

    jsval jsret = std_string_to_jsval(ctx, str);
    args.rval().set(jsret);
    return true;
}

bool js_native_device_get_password(JSContext* ctx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    std::string id = nativeGetDeviceID();

    unsigned long hash = 5381;
    int c;

    char* str = (char*)id.c_str();
    while (c = *str++) {
        hash = ((hash << 5) + hash) + c; /* hash * 33 + c */
    }

    std::ostringstream os ;
    os << hash;

    std::string res(os.str());
    jsval jsret = std_string_to_jsval(ctx, res);
    args.rval().set(jsret);
    return true;
}

bool js_native_device_copy_clipboard(JSContext* ctx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);

    std::string content;
    bool ok = jsval_to_std_string(ctx, args.get(0), &content);
    JSB_PRECONDITION2(ok, ctx, false, "js_native_device_copy_clipboard : Error processing arguments");

    nativeCopyClipboard(content);       
    return true;
}

bool js_native_device_open_sms_app(JSContext* ctx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);

    std::string to;
    bool ok = jsval_to_std_string(ctx, args.get(0), &to);
    JSB_PRECONDITION2(ok, ctx, false, "js_native_device_open_sms_app : Error processing arguments");

    std::string body;
    ok = jsval_to_std_string(ctx, args.get(1), &body);
    JSB_PRECONDITION2(ok, ctx, false, "js_native_device_open_sms_app : Error processing arguments");

    nativeOpenSMSApp(to, body);       
    return true;
}

void register_nativeDevice(JSContext* cx, JS::HandleObject global)
{
    JS::RootedObject jsbObj(cx);
    get_or_create_js_obj(cx, global, "nativeDevice", &jsbObj);

    JS_DefineFunction(cx, jsbObj, "getID", js_native_device_get_id, 0, JSPROP_READONLY | JSPROP_PERMANENT);
    JS_DefineFunction(cx, jsbObj, "getPassword", js_native_device_get_password, 0, JSPROP_READONLY | JSPROP_PERMANENT);
    JS_DefineFunction(cx, jsbObj, "copyClipboard", js_native_device_copy_clipboard, 1, JSPROP_READONLY | JSPROP_PERMANENT);
    JS_DefineFunction(cx, jsbObj, "openSMSApp", js_native_device_open_sms_app, 2, JSPROP_READONLY | JSPROP_PERMANENT);
}
