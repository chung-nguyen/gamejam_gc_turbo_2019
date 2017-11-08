//
//  nativeAnalytic.m
//  client
//
//  Created by Tin Nguyen on 2/4/17.
//
//

#import <Foundation/Foundation.h>
#import <Firebase.h>
#include <string>
#include <map>



void nativeAnalyticsSetUserProperty(std::string key, std::string val)
{
    [FIRAnalytics setUserPropertyString:[NSString stringWithUTF8String:key.c_str()]
                                forName:[NSString stringWithUTF8String:val.c_str()]];
}

void nativeAnalyticsSetUserId(std::string userId)
{
    //TODO
    //TTin: Temporary
    nativeAnalyticsSetUserProperty("id", userId);
    
}

void nativeAnalyticsSetCurrentScreen(std::string name, std::string className)
{
    //TODO
}

void nativeAnalyticsLogEvent(std::string eventName, std::map<std::string, std::string> params)
{
    
    NSMutableDictionary<NSString *, NSObject *> *dicParams = [[NSMutableDictionary alloc] init];
    
    for (const auto& kv : params) {
        NSString* key = [NSString stringWithUTF8String:kv.first.c_str()];
        NSString* val = [NSString stringWithUTF8String:kv.second.c_str()];
        
        dicParams[key] = val;
    }
    
    [FIRAnalytics logEventWithName:[NSString stringWithUTF8String:eventName.c_str()]
                        parameters:dicParams];
}
