#ifndef __jsb_iab__
#define __jsb_iab__

#include "jsapi.h"
#include "jsfriendapi.h"

void register_iab(JSContext* cx, JS::HandleObject global);

void nativeIABLaunchPurchaseFlow(std::string sku, int requestCode, std::string payload);
void nativeIABLaunchSubscriptionPurchaseFlow(std::string sku, int requestCode, std::string payload);
bool nativeIABSubscriptionsSupported() ;
std::string nativeIABGetPurchaseJson();
void nativeIABPopPurchase();

#endif /* defined(__jsb_iab__) */
