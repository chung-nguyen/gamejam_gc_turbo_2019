#include "../../Classes/AppDelegate.h"

USING_NS_CC;

void nativeIABLaunchPurchaseFlow(std::string sku, int requestCode, std::string payload) 
{

}

void nativeIABLaunchSubscriptionPurchaseFlow(std::string sku, int requestCode, std::string payload) 
{

}

bool nativeIABSubscriptionsSupported() 
{
    return false;
}

void nativeIABConsume(std::string jsonData) 
{
}

std::string nativeIABGetPurchaseJson()
{
    return "";
}

void nativeIABPopPurchase()
{

}
