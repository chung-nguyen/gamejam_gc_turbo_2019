#ifndef __jsb_nativeDevice__
#define __jsb_nativeDevice__

#include "jsapi.h"
#include "jsfriendapi.h"

void register_nativeDevice(JSContext* cx, JS::HandleObject global);

std::string nativeGetDeviceID();
void nativeCopyClipboard(std::string content);
void nativeOpenSMSApp(std::string to, std::string body);

#endif /* defined(__jsb_nativeDevice__) */
