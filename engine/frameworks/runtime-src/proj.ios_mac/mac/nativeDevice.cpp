#include "../../Classes/AppDelegate.h"

USING_NS_CC;

unsigned short getCpuHash();
unsigned short getCpuHash();
void getMacHash(unsigned short& mac1, unsigned short& mac2);

std::string nativeGetDeviceID()
{
    char res[256];
    unsigned short mac1, mac2;
    getMacHash(mac1, mac2);
    sprintf(res, "%d:%d:%d:%d", getCpuHash(), getCpuHash(), mac1, mac2);
    return std::string(res);
}

void nativeCopyClipboard(std::string content)
{

}

void nativeOpenSMSApp(std::string to, std::string body)
{

}
