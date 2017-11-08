#ifndef __jsb_firebaseMessaging__
#define __jsb_firebaseMessaging__

#include "jsapi.h"
#include "jsfriendapi.h"

void register_firebaseMessaging(JSContext* cx, JS::HandleObject global);

void nativeFCMSetGameShowingNotification(bool value);
bool nativeFCMPopNotification(std::string& os, std::string& jsonData);
std::string nativeFCMGetToken();
void nativeFCMSubscribe(std::string topic);
void nativeFCMUnsubscribe(std::string topic);

#endif /* defined(__jsb_firebaseMessaging__) */
