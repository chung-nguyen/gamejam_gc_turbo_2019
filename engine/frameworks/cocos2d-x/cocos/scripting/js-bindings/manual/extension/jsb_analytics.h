#ifndef __jsb_analytics__
#define __jsb_analytics__

#include "jsapi.h"
#include "jsfriendapi.h"

void register_analytics(JSContext* cx, JS::HandleObject global);

void nativeAnalyticsSetUserId(std::string userId);
void nativeAnalyticsSetUserProperty(std::string key, std::string val);
void nativeAnalyticsSetCurrentScreen(std::string name, std::string className);
void nativeAnalyticsLogEvent(std::string eventName, std::map<std::string, std::string> params);

#endif /* defined(__jsb_analytics__) */
