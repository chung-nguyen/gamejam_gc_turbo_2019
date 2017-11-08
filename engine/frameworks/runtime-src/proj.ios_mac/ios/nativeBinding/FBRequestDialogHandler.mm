//
//  FBRequestDialogHandler.m
//  client
//
//  Created by Tin Nguyen on 2/8/17.
//
//

#import <Foundation/Foundation.h>
#import "FBRequestDialogHandler.h"
#import <string>

extern NSString *nativeUtilsDicToJson(NSDictionary * dictionaryOrArrayToOutput);

@implementation FBRequestDialogHandler

- (void)setCallback: (FacebookCallbackFunction)cb {
    self->_callback = cb;
}

- (void)gameRequestDialogDidCancel:(FBSDKGameRequestDialog *)gameRequestDialog {
    NSDictionary * resDic = @{
                              @"request": @""
                              };
    NSString* res = nativeUtilsDicToJson(resDic);
    self->_callback([res UTF8String]);

}

- (void)gameRequestDialog:(FBSDKGameRequestDialog *)gameRequestDialog didCompleteWithResults:(NSDictionary *)results {
    NSString* res = nativeUtilsDicToJson(results);
    self->_callback([res UTF8String]);
}

- (void)gameRequestDialog:(FBSDKGameRequestDialog *)gameRequestDialog didFailWithError:(NSError *)error {
    NSDictionary * resDic = @{
                              @"request": @""
    };
    NSString* res = nativeUtilsDicToJson(resDic);
    self->_callback([res UTF8String]);
}

@end

