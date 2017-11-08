#ifndef __jsb_crashReport__
#define __jsb_crashReport__

#include "jsapi.h"
#include "jsfriendapi.h"

void register_crashReport(JSContext* cx, JS::HandleObject global);

void nativeCrashReport(std::string message);
void nativeCrashLog(std::string message);
void nativeCrashLogcat(std::string message);

#endif /* defined(__jsb_crashReport__) */
