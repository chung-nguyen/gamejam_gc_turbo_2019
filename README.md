# README

## Setup
1. Download cocos2dx, extract somewhere and run the setup python script.
2. To build Android, install the latest Android Studio, and then install required SDK level (23)
3. Install latest NodeJS

### On Mac:
1. Install brew
2. Install xcode command line
3. Install Cocoa Pod

## Install
1. Run npm install at root
2. Run script install.sh inside folder tools

## Run the game

### On browser
1. Make sure port 8080 is not in use
2. CD to folder scripts
3. Run makeRes.sh to generate resources
4. Run makeGame.sh to seed a bundle.js
5. Run runDev.sh bash
6. In browser, go to localhost:8080

### Qt Project
1. In scripts, run runDev.sh to start local dev server, so whenever javascript get changed, a new bundle.js file is generated in folder engine/_dist
2. Open engine/CMakeLists.txt to start the project
3. Build and Run
4. Press F5 to reload the bundle.js file and restart the game engine

### Android
1. Run scripts/makeAndroid.sh
2. Install on device and run

### iOS
1. Inside engine/frameworks/runtime-src/proj.ios_mac, run pod install
2. Open the xcode project in engine/frameworks/runtime-src/proj.ios_mac
3. Select mobile scheme
4. Compile and run

### Mac
1. Run the local dev server like above instructions (Qt Project)
2. Open the xcode project in engine/frameworks/runtime-src/proj.ios_mac
3. Select desktop scheme
4. Compile and run
5. Press F5 to reload the bundle.js file and restart the game engine

## Developer Notes

### Generate Java native signature
+ First create a blank Java class file and compile it with javac.
Example:
class Test {
	public void Say(String message);

	public static native void onSay(boolean result);
}

+ To generate Java signature:
javap -classpath . Test

+ To generate Jni header file:
javah -jni Test

### How Facebook was integrated

### Web
1. In index.html, add facebook web javascript files.
2. A javascript interface for web was created: src/cocos_html5_facebook.js, this file interfaces the native binding for web version.
3. Note that we need a singleton named "facebook" and several methods which is very easy to implement in web.

### Android

1. First, native bindings were created with empty implementations (thus return empty values).
1.a. In folder frameworks/cocos2d-x/cocos/scripting/js-bindings/manual/extension, create jsb_facebook.cpp and jsb_facebook.h files.
1.b. Note the function register_facebook and where it is called: frameworks/runtime-src/Classes/AppDelegate.cpp
1.c. Add jsb_facebook.cpp to the CMake file: frameworks/cocos2d-x/cocos/scripting/js-bindings/CMakeLists.txt
1.d. After this we have zero functional facebook singleton that can be called in javascript.

2. Now explain the NDK implementation for the binding to work out. For Android, note this stack: Java -> NDK -> native binding -> Javascript, and we need to implement at every segment. At the moment, we have the native binding part done. Next part will be the NDK.

3. In this binding, there are 4 NDK functions needed to be done: nativeFacebookIsInitialized, nativeFacebookGetLoginStatus, nativeFacebookLogin, nativeFacebookLogout, nativeFacebookGameRequestDialog.
3.a. Note that most functions need a C++ function pointer to be passed-in: typedef void (*FacebookLoginCallbackFunction)(bool, std::string, std::string, std::string, long long). The function pointer will be called when the NDK function finished the async facebook task.
3.b. The parameters in the callback function pointer are: (bool success, std::string status, std::string accessToken, std::string userId, long long expirationTime).

4. Add NDK functions in frameworks/runtime-src/proj.android-studio/app/jni/facebook.cpp
4.a. Add the file name to Android.mk
4.b. The NDK functions call Java counter-parts. But it is very difficult to pass in Java callback inside NDK calls, so we have a Java native binding here: Java_com_gamebai_AndroidFacebook_onJniFacebookLoginResult
4.c. The Java native binding will be called as callback in Java facebook calls, and then in turn, call the native function pointer.

5. Add Java implementations.

### iOS
Ios & Mac Project: `frameworks/runtime-src/proj.ios_mac/client.xcworkspace`

1. Ensure `cocoapods` installed ([link](https://guides.cocoapods.org/using/getting-started.html#getting-started))
1.a. cd to frameworks/runtime-src/proj.ios_mac -> terminal `pod install`

2. The Obj-C implementation is located at: frameworks/runtime-src/proj.ios_mac/ios/nativeBinding/nativeFacebook.mm
2.a. Just implement the 4 functions: nativeFacebookIsInitialized, nativeFacebookGetLoginStatus, nativeFacebookLogin, nativeFacebookLogout, similar to how Android was done.
