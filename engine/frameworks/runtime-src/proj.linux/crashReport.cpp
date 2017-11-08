#include "../Classes/AppDelegate.h"

USING_NS_CC;

void nativeCrashReport(std::string message)
{
    fprintf(stderr, "%s", message.c_str());
}

void nativeCrashLog(std::string message)
{
}

void nativeCrashLogcat(std::string message)
{
}
