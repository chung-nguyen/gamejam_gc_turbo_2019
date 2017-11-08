//
//  Header.h
//  client
//
//  Created by Tin Nguyen on 2/8/17.
//
//

#ifndef Header_h
#define Header_h

#import <FBSDKShareKit/FBSDKGameRequestDialog.h>
#import <string>
typedef void (*FacebookCallbackFunction)(std::string);

@interface FBRequestDialogHandler : NSObject <FBSDKGameRequestDialogDelegate> {
    FacebookCallbackFunction _callback;
}
- (void)setCallback: (FacebookCallbackFunction)cb;
@end

#endif /* Header_h */
