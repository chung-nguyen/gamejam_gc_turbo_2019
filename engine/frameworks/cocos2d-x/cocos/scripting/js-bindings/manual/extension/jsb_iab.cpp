#include <string>
#include <sstream>

#include "base/CCDirector.h"
#include "base/CCScheduler.h"

#include "scripting/js-bindings/manual/extension/jsb_iab.h"
#include "extensions/cocos-ext.h"
#include "scripting/js-bindings/manual/ScriptingCore.h"
#include "scripting/js-bindings/manual/cocos2d_specifics.hpp"
#include "scripting/js-bindings/auto/jsb_cocos2dx_auto.hpp"
#include <thread>

USING_NS_CC;
USING_NS_CC_EXT;

bool js_iab_launch_purchase_flow(JSContext* ctx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);

    std::string sku;
    bool ok = jsval_to_std_string(ctx, args.get(0), &sku);
    JSB_PRECONDITION2(ok, ctx, false, "js_iab_launch_purchase_flow : Error processing arguments");

    int requestCode;
    ok = jsval_to_int32(ctx, args.get(1), &requestCode);
    JSB_PRECONDITION2(ok, ctx, false, "js_iab_launch_purchase_flow : Error processing arguments");

    std::string payload;
    ok = jsval_to_std_string(ctx, args.get(2), &sku);
    JSB_PRECONDITION2(ok, ctx, false, "js_iab_launch_purchase_flow : Error processing arguments");

    nativeIABLaunchPurchaseFlow(sku, requestCode, payload);       
    return true;
}

bool js_iab_launch_subscription_purchase_flow(JSContext* ctx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);

    std::string sku;
    bool ok = jsval_to_std_string(ctx, args.get(0), &sku);
    JSB_PRECONDITION2(ok, ctx, false, "js_iab_launch_subscription_purchase_flow : Error processing arguments");

    int requestCode;
    ok = jsval_to_int32(ctx, args.get(1), &requestCode);
    JSB_PRECONDITION2(ok, ctx, false, "js_iab_launch_subscription_purchase_flow : Error processing arguments");

    std::string payload;
    ok = jsval_to_std_string(ctx, args.get(2), &sku);
    JSB_PRECONDITION2(ok, ctx, false, "js_iab_launch_subscription_purchase_flow : Error processing arguments");

    nativeIABLaunchSubscriptionPurchaseFlow(sku, requestCode, payload);       
    return true;
}

bool js_iab_subscription_supported(JSContext* ctx, uint32_t argc, jsval *vp)
{
    bool res = nativeIABSubscriptionsSupported();

    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    args.rval().set(BOOLEAN_TO_JSVAL(res));
    return true;
}

bool js_iab_get_purchase(JSContext* ctx, uint32_t argc, jsval *vp)
{
    std::string res = nativeIABGetPurchaseJson();

    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);

    JS::RootedValue outVal(ctx);

    jsval strVal = std_string_to_jsval(ctx, res);
    JS::RootedString jsstr(ctx, strVal.toString());
    bool ok = JS_ParseJSON(ctx, jsstr, &outVal);
    if (ok)
    {    
        args.rval().set(outVal);
    }

    return true;
}

bool js_iab_pop_purchase(JSContext* ctx, uint32_t argc, jsval *vp)
{
    nativeIABPopPurchase();
    return true;
}

void register_iab(JSContext* cx, JS::HandleObject global)
{
    JS::RootedObject jsbObj(cx);
    get_or_create_js_obj(cx, global, "iab", &jsbObj);

    JS_DefineFunction(cx, jsbObj, "launchPurchaseFlow", js_iab_launch_purchase_flow, 3, JSPROP_READONLY | JSPROP_PERMANENT);
    JS_DefineFunction(cx, jsbObj, "launchSubscriptionPurchaseFlow", js_iab_launch_subscription_purchase_flow, 3, JSPROP_READONLY | JSPROP_PERMANENT);
    JS_DefineFunction(cx, jsbObj, "subscriptionsSupported", js_iab_subscription_supported, 0, JSPROP_READONLY | JSPROP_PERMANENT);
    JS_DefineFunction(cx, jsbObj, "getPurchase", js_iab_get_purchase, 0, JSPROP_READONLY | JSPROP_PERMANENT);
    JS_DefineFunction(cx, jsbObj, "popPurchase", js_iab_pop_purchase, 0, JSPROP_READONLY | JSPROP_PERMANENT);
}
