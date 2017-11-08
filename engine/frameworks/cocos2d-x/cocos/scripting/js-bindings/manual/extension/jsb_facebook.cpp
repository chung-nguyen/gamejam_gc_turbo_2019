#include <string>
#include <sstream>

#include "base/CCDirector.h"
#include "base/CCScheduler.h"

#include "scripting/js-bindings/manual/extension/jsb_facebook.h"
#include "extensions/cocos-ext.h"
#include "scripting/js-bindings/manual/ScriptingCore.h"
#include "scripting/js-bindings/manual/cocos2d_specifics.hpp"
#include "scripting/js-bindings/auto/jsb_cocos2dx_auto.hpp"
#include <thread>

USING_NS_CC;
USING_NS_CC_EXT;

class FacebookTaskStatus {
    public:
        JS::Heap<JSObject*> callback;
        bool isRunning;
        bool hasResult;
        std::string jsonResponse;

        void perform()
        {
            Director::getInstance()->getScheduler()->performFunctionInCocosThread([&, this] {
                this->callJs();
            });
        }

        void callJs()
        {
            JSContext* ctx = ScriptingCore::getInstance()->getGlobalContext();
            JS::RootedValue callback(ctx, OBJECT_TO_JSVAL(this->callback));
            if (!callback.isNull()) {
                JS::RootedObject global(ctx, ScriptingCore::getInstance()->getGlobalObject());
                JS::RootedValue outVal(ctx);

                jsval strVal = std_string_to_jsval(ctx, this->jsonResponse);
                JS::RootedString jsstr(ctx, strVal.toString());
                bool ok = JS_ParseJSON(ctx, jsstr, &outVal);
                if (ok)
                {
                    JS::RootedObject outValObj(ctx, outVal.toObjectOrNull());
                    jsval valArr[1];
                    valArr[0] = OBJECT_TO_JSVAL(outValObj);
                    JS::RootedValue retval(ctx);

                    JS_CallFunctionValue(ctx, global, callback, JS::HandleValueArray::fromMarkedLocation(1, valArr), &retval);
                }
            }
        }
};

FacebookTaskStatus taskStatus;

void onFacebookLoginResult(std::string jsonResponse) {
    taskStatus.isRunning = false;
    taskStatus.hasResult = true;
    taskStatus.jsonResponse = jsonResponse;
}

bool js_facebook_isInitialized(JSContext* ctx, uint32_t argc, jsval *vp)
{
    bool res = nativeFacebookIsInitialized();

    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    args.rval().set(BOOLEAN_TO_JSVAL(res));
    return true;
}

bool js_facebook_getLoginStatus(JSContext* ctx, uint32_t argc, jsval *vp)
{
    if (taskStatus.isRunning) {
        return false;
    }

    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject _jsCallback(ctx, args.get(0).toObjectOrNull());

    taskStatus.callback = _jsCallback;
    taskStatus.isRunning = true;
    taskStatus.hasResult = false;

    nativeFacebookGetLoginStatus(onFacebookLoginResult);

    return true;
}

bool js_facebook_login(JSContext* ctx, uint32_t argc, jsval *vp)
{
    if (taskStatus.isRunning) {
        return false;
    }

    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject _jsCallback(ctx, args.get(0).toObjectOrNull());

    std::map<std::string, std::string> params;
    bool ok = jsval_to_std_map_string_string(ctx, args.get(1), &params);    
    JSB_PRECONDITION2(ok, ctx, false, "js_facebook_api : Error processing arguments");

    taskStatus.callback = _jsCallback;
    taskStatus.isRunning = true;
    taskStatus.hasResult = false;

    nativeFacebookLogin(onFacebookLoginResult, params);

    return true;
}

bool js_facebook_logout(JSContext* ctx, uint32_t argc, jsval *vp)
{
    if (taskStatus.isRunning) {
        return false;
    }

    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject _jsCallback(ctx, args.get(0).toObjectOrNull());

    taskStatus.callback = _jsCallback;
    taskStatus.isRunning = true;
    taskStatus.hasResult = false;

    nativeFacebookLogout(onFacebookLoginResult);

    return true;
}

bool js_facebook_open_game_request_dialog(JSContext* ctx, uint32_t argc, jsval *vp)
{
    if (taskStatus.isRunning) {
        return false;
    }

    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);

    std::string message;
    bool ok = jsval_to_std_string(ctx, args.get(0), &message);
    JSB_PRECONDITION2(ok, ctx, false, "js_facebook_open_game_request_dialog : Error processing arguments");

    JS::RootedObject _jsCallback(ctx, args.get(1).toObjectOrNull());

    taskStatus.callback = _jsCallback;
    taskStatus.isRunning = true;
    taskStatus.hasResult = false;

    nativeFacebookGameRequestDialog(message, onFacebookLoginResult);

    return true;
}

bool js_facebook_api(JSContext* ctx, uint32_t argc, jsval *vp)
{
    if (taskStatus.isRunning) {
        return false;
    }

    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);

    std::string path;
    bool ok = jsval_to_std_string(ctx, args.get(0), &path);
    JSB_PRECONDITION2(ok, ctx, false, "js_facebook_api : Error processing arguments");

    std::string method;
    ok = jsval_to_std_string(ctx, args.get(1), &method);
    JSB_PRECONDITION2(ok, ctx, false, "js_facebook_api : Error processing arguments");

    std::map<std::string, std::string> params;
    ok = jsval_to_std_map_string_string(ctx, args.get(2), &params);    
    JSB_PRECONDITION2(ok, ctx, false, "js_facebook_api : Error processing arguments");

    JS::RootedObject _jsCallback(ctx, args.get(3).toObjectOrNull());

    taskStatus.callback = _jsCallback;
    taskStatus.isRunning = true;
    taskStatus.hasResult = false;

    nativeFacebookAPI(path, method, params, onFacebookLoginResult);

    return true;
}

bool js_facebook_update(JSContext* ctx, uint32_t argc, jsval *vp)
{
    if (!taskStatus.isRunning && taskStatus.hasResult) {
        taskStatus.hasResult = false;
        taskStatus.callJs();
    }
    return true;
}

void register_facebook(JSContext* cx, JS::HandleObject global)
{
    JS::RootedObject jsbObj(cx);
    get_or_create_js_obj(cx, global, "facebook", &jsbObj);

    JS_DefineFunction(cx, jsbObj, "isInitialized", js_facebook_isInitialized, 0, JSPROP_READONLY | JSPROP_PERMANENT);
    JS_DefineFunction(cx, jsbObj, "getLoginStatus", js_facebook_getLoginStatus, 1, JSPROP_READONLY | JSPROP_PERMANENT);
    JS_DefineFunction(cx, jsbObj, "login", js_facebook_login, 2, JSPROP_READONLY | JSPROP_PERMANENT);
    JS_DefineFunction(cx, jsbObj, "logout", js_facebook_logout, 1, JSPROP_READONLY | JSPROP_PERMANENT);
    JS_DefineFunction(cx, jsbObj, "openGameRequestDialog", js_facebook_open_game_request_dialog, 1, JSPROP_READONLY | JSPROP_PERMANENT);
    JS_DefineFunction(cx, jsbObj, "api", js_facebook_api, 4, JSPROP_READONLY | JSPROP_PERMANENT);
    JS_DefineFunction(cx, jsbObj, "update", js_facebook_update, 0, JSPROP_READONLY | JSPROP_PERMANENT);
}
