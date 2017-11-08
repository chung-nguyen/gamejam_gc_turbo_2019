//
//  nativeDevice.m
//  client
//
//  Created by Pose on 12/29/16.
//
//

#import <Foundation/Foundation.h>

#include <string>
using namespace std;

std::string nativeGetDeviceID()
{
    NSString *uniqueIdentifier = [[[UIDevice currentDevice] identifierForVendor] UUIDString];
    std::string res([uniqueIdentifier UTF8String]);
    return res;
}

void nativeCopyClipboard(std::string content)
{
    UIPasteboard *pasteboard = [UIPasteboard generalPasteboard];
    pasteboard.string = [NSString stringWithUTF8String:content.c_str()];
}

void nativeOpenSMSApp(std::string to, std::string body)
{
    NSString *sms = [NSString stringWithFormat:@"sms:%@&body=%@",
        [NSString stringWithUTF8String:to.c_str()], [NSString stringWithUTF8String:body.c_str()]];
    
    NSString *url = [sms stringByAddingPercentEscapesUsingEncoding:NSUTF8StringEncoding];
    [[UIApplication sharedApplication] openURL:[NSURL URLWithString:url]];
}
