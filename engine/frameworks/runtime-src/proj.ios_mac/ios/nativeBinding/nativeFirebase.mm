//
//  nativeFirebase.m
//  client
//
//  Created by Tin Nguyen on 2/4/17.
//
//

#import <Foundation/Foundation.h>
#import <Firebase.h>
#include <string>
#include <queue>

//---------------------------------------------------------------------------------------//
//  Static Variables
//---------------------------------------------------------------------------------------//
static std::queue<std::string> messageQueue;

//---------------------------------------------------------------------------------------//
//  Utils Functions
//---------------------------------------------------------------------------------------//

NSString *nativeUtilsDicToJson(NSDictionary * dictionaryOrArrayToOutput) {
    
    if (dictionaryOrArrayToOutput == nil)
        return nil;
    
    NSError *error;
    NSData *jsonData = [NSJSONSerialization dataWithJSONObject:dictionaryOrArrayToOutput
                                                       options:0
                                                         error:&error];
    
    if (! jsonData) {
        return nil;
    } else {
        NSString *jsonString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
        return jsonString;
    }
}

//---------------------------------------------------------------------------------------//
// Called by AppDelegate
//---------------------------------------------------------------------------------------//
void nativeFCMMessageEnqueue(std::string jsonData) {
    messageQueue.push(jsonData);
}


void nativeFCMSetGameShowingNotification(bool value)
{
    //TODO
}

bool nativeFCMPopNotification(std::string& os, std::string& jsonData)
{
    if(messageQueue.empty())
        return false;
    
    os = "ios";
    jsonData = messageQueue.back();
    
    messageQueue.pop();
    
    return true;
}

std::string nativeFCMGetToken()
{
    NSString *refreshedToken = [[FIRInstanceID instanceID] token];
    
    if(refreshedToken == nil)
        return "";
    
    return [refreshedToken UTF8String];
}

void nativeFCMSubscribe(std::string topic)
{
    NSString * tmp = [NSString stringWithUTF8String:topic.c_str()];
    [[FIRMessaging messaging] subscribeToTopic:tmp];
    
    NSLog(@"Subscribed topic: %@", tmp);
}

void nativeFCMUnsubscribe(std::string topic)
{
    NSString * tmp = [NSString stringWithUTF8String:topic.c_str()];
    [[FIRMessaging messaging] unsubscribeFromTopic:tmp];
    
    NSLog(@"Unsubscribe topic: %@", tmp);
}
