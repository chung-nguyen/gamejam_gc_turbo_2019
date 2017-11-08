#ifndef __NATIVEENGINEBINDING_H__
#define __NATIVEENGINEBINDING_H__

#include "jsapi.h"
#include "jsfriendapi.h"

void register_native_engine(JSContext* cx, JS::HandleObject global);
void initializeNativeEngine();
void destroyNativeEngine();

#endif // __NATIVEENGINEBINDING_H__
