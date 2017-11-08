#ifndef __jsb_facebook__
#define __jsb_facebook__

#include "jsapi.h"
#include "jsfriendapi.h"

typedef void (*FacebookCallbackFunction)(std::string);

void register_facebook(JSContext* cx, JS::HandleObject global);

bool nativeFacebookIsInitialized();
void nativeFacebookGetLoginStatus(FacebookCallbackFunction cb);
void nativeFacebookLogin(FacebookCallbackFunction cb, std::map<std::string, std::string> params);
void nativeFacebookLogout(FacebookCallbackFunction cb);
void nativeFacebookGameRequestDialog(std::string message, FacebookCallbackFunction cb);
void nativeFacebookAPI(std::string path, std::string method, std::map<std::string, std::string> params, FacebookCallbackFunction cb);

#endif /* defined(__jsb_facebook__) */
