#include <unistd.h>
#include "../Classes/AppDelegate.h"

USING_NS_CC;

unsigned short getCpuHash();
unsigned short getCpuHash();
void getMacHash(unsigned short& mac1, unsigned short& mac2);

unsigned int simpleStringHash(char *str)
{
    unsigned long hash = 5381;
    int c;

    while (c = *str++)
        hash = ((hash << 5) + hash) + c; /* hash * 33 + c */

    return hash;
}


std::string nativeGetDeviceID()
{
    char selfExe[256];
    readlink("/proc/self/exe", selfExe, 256);

    char res[256];
    unsigned short mac1, mac2;
    getMacHash(mac1, mac2);
    sprintf(res, "%x:%x:%x:%x:%x", getCpuHash(), getCpuHash(), mac1, mac2, simpleStringHash(selfExe));
    return std::string(res);
}

void nativeCopyClipboard(std::string content)
{

}

void nativeOpenSMSApp(std::string to, std::string body)
{

}
