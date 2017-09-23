# song-number
SongNumber is a small mobile app that will allow user to set a song number from a list of song books and cast it

###Build
* sudo npm install -g ionic cordova
* cordova platforms add android
* ionic cordova plugin add cordova-plugin-camera
* npm install --save @ionic-native/camera
* ionic cordova plugin add cordova-plugin-splashscreen
* npm install --save @ionic-native/splash-screen
* ionic cordova plugin add https://github.com/Fl0r14n/cordova-chromecast
* ionic cordova plugin add cordova-plugin-background-mode
* npm install --save @ionic-native/background-mode
* npm install --save @ionic/storage

* android update project --subprojects --path "platforms/android" --target android-25 --library "CordovaLib"
* ionic cordova resources 
* ionic build android

###Deploy
* set android phone in develop mode 
* ionic cordova run android

###Setup Receiver App
* Get a Chromecast device and get it set up for development: https://developers.google.com/cast/docs/developers#Get_started
* Register an application on the Developers Console (http://cast.google.com/publish). Select the Custom Receiver option and specify the URL to where you are hosting the receiver index.html file
* Insert your App ID in the src/providers/chromecast.ts file
* Copy index.html from receiver to your own server

### License
See LICENSE



