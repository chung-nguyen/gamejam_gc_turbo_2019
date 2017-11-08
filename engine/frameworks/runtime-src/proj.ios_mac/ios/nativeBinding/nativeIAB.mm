//
//  nativeIAB.m
//  client
//
//  Created by Tin Nguyen on 2/7/17.
//
//

#import <Foundation/Foundation.h>
#include <string>


void nativeIABLaunchPurchaseFlow(std::string sku, int requestCode, std::string payload)
{
    //TODO
}
void nativeIABLaunchSubscriptionPurchaseFlow(std::string sku, int requestCode, std::string payload)
{
    //TODO
}
bool nativeIABSubscriptionsSupported()
{
    //TODO
    return false;
}
void nativeIABConsume(std::string jsonData)
{
    //TODO
}
std::string nativeIABGetPurchaseJson()
{
    //TODO
    return "";
}
void nativeIABPopPurchase()
{
    //TODO
}
