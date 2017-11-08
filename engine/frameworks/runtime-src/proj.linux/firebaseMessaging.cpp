#include "../Classes/AppDelegate.h"

USING_NS_CC;

bool nativeFCMPopNotification(std::string& os, std::string& jsonData)
{
    return false;
}

void nativeFCMSetGameShowingNotification(bool value)
{
}

std::string nativeFCMGetToken()
{
    return "";
}

void nativeFCMSubscribe(std::string topic)
{
}

void nativeFCMUnsubscribe(std::string topic)
{
}
