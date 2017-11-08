//
//  nativeFacebook.m
//  client
//
//  Created by Pose on 12/29/16.
//
//
#import <FBSDKCoreKit/FBSDKCoreKit.h>
#import <FBSDKLoginKit/FBSDKLoginKit.h>
#import <FBSDKShareKit/FBSDKGameRequestContent.h>
#import <FBSDKShareKit/FBSDKGameRequestDialog.h>
#import <Foundation/Foundation.h>
#include "FBRequestDialogHandler.h"
#include <string>
#include <map>


static UIViewController* s_sharedViewController;

extern NSString *nativeUtilsDicToJson(NSDictionary * dictionaryOrArrayToOutput);

typedef void (*FacebookCallbackFunction)(std::string);

// DEFINE
NSArray* PERMISSIONS = @[@"public_profile"];


void _raiseLoginCallback( FBSDKAccessToken* tokenObj, FacebookCallbackFunction cb) {
    
    if(tokenObj == nil) {
        NSDictionary * resDic = @{
                               @"status": @"unknown",
                               @"authResponse": @{
                                       @"accessToken": @"",
                                       @"expiresIn":@"",
                                       @"userID":@""
        }};
        NSString* res = nativeUtilsDicToJson(resDic);

        cb([res UTF8String]);
    } else {
        NSDictionary * resDic = @{
                                  @"status": @"connected",
                                  @"authResponse": @{
                                          @"accessToken": [tokenObj tokenString],
                                          @"expiresIn": [[NSNumber alloc] initWithDouble:[[tokenObj expirationDate ] timeIntervalSince1970] / 1000],
                                          @"userID":[tokenObj userID]
        }};
        NSString* res = nativeUtilsDicToJson(resDic);
        
        cb([res UTF8String]);
    }
}

void nativeFacebookLogin(FacebookCallbackFunction cb, std::map<std::string, std::string> params)
{
    
    FBSDKLoginManager *login = [[FBSDKLoginManager alloc] init];
    [login
     logInWithReadPermissions: PERMISSIONS
     fromViewController:s_sharedViewController
     handler:^(FBSDKLoginManagerLoginResult *result, NSError *error) {
         if (error) {
             NSLog(@"Process error");
             _raiseLoginCallback(nil, cb);
         } else if (result.isCancelled) {
             NSLog(@"Cancelled");
             _raiseLoginCallback(nil, cb);
         } else {
             NSLog(@"Logged in");
             _raiseLoginCallback([result token], cb);
         }
     }];

}


bool nativeFacebookIsInitialized()
{
    // TTin: always return true
    return true;
}

void nativeFacebookGetLoginStatus(FacebookCallbackFunction cb)
{

    NSLog(@"nativeFacebookGetLoginStatus");
    
    FBSDKAccessToken* accessToken = [FBSDKAccessToken currentAccessToken];
    _raiseLoginCallback(accessToken, cb);
    
}

void nativeFacebookLogout(FacebookCallbackFunction cb)
{
    
    NSLog(@"nativeFacebookLogout");
    
    FBSDKLoginManager *loginManager = [[FBSDKLoginManager alloc] init];
    [loginManager logOut];
    
    [FBSDKAccessToken setCurrentAccessToken:nil];
    
    _raiseLoginCallback(nil, cb);

}

void nativeFacebookGameRequestDialog(std::string message, FacebookCallbackFunction cb)
{

    NSLog(@"nativeFacebookGameRequestDialog");
    
    FBSDKGameRequestContent *gameRequestContent = [[FBSDKGameRequestContent alloc] init];
    // Look at FBSDKGameRequestContent for futher optional properties
    gameRequestContent.message = [NSString stringWithUTF8String:message.c_str()];
    
    //Implements <FBSDKGameRequestDialogDelegate>
    FBRequestDialogHandler *deg = [[FBRequestDialogHandler alloc] init];
    [deg setCallback:cb];
    
    [FBSDKGameRequestDialog showWithContent:gameRequestContent delegate:deg];
}

void nativeFacebookAPI(std::string path, std::string method, std::map<std::string, std::string> params, FacebookCallbackFunction cb)
{
    // If not loged-in. Return error
    FBSDKAccessToken* accessToken = [FBSDKAccessToken currentAccessToken];
    if(accessToken == nil) {
        NSDictionary * resDic = @{
                                  @"error": @{
                                          @"message": @"The access token could not be decrypted",
                                          @"type": @"OAuthException",
        }};
        NSString* res = nativeUtilsDicToJson(resDic);
        cb([res UTF8String]);
        return;
    }
    
    // Construct Data
    NSString* rPath = [NSString stringWithUTF8String:path.c_str()];
    NSMutableDictionary<NSString *, NSObject *> *dicParams = [[NSMutableDictionary alloc] init];
    
    for (const auto& kv : params) {
        NSString* key = [NSString stringWithUTF8String:kv.first.c_str()];
        NSString* val = [NSString stringWithUTF8String:kv.second.c_str()];
        
        dicParams[key] = val;
    }
    
    // Request
    [[[FBSDKGraphRequest alloc] initWithGraphPath:rPath parameters:dicParams]
     startWithCompletionHandler:^(FBSDKGraphRequestConnection *connection, id result, NSError *error) {
         if (error) {
             NSDictionary * resDic = @{
                                       @"error": @{
                                               @"message": [error localizedDescription],
             }};
             NSString* res = nativeUtilsDicToJson(resDic);
             cb([res UTF8String]);
             return;
         }
         
         // Return response data as JSON
         NSString* res = nativeUtilsDicToJson(result);
         cb([res UTF8String]);
     }];
}
