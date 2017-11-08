//
//  nativeCrashReport.m
//  client
//
//  Created by Tin Nguyen on 2/5/17.
//
//

#import <Foundation/Foundation.h>
#include <string>
#include <Firebase.h>

void nativeCrashReport(std::string message)
{
    FIRCrashLog(@"%@",[NSString stringWithUTF8String:message.c_str()]);
//    assert(false);
}

void nativeCrashLog(std::string message)
{
    FIRCrashLog(@"%@",[NSString stringWithUTF8String:message.c_str()]);
//    assert(false);
}

void nativeCrashLogcat(std::string message)
{
    NSLog(@"%@", [NSString stringWithUTF8String:message.c_str()]);
}
