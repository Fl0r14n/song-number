# song-number
SongNumber is a small mobile app that will allow user to set a song number from a list of song books and cast it

###Build
* sudo npm install -g ionic2 cordova@6.3.0
* cordova platforms add android
* ionic plugin add cordova-plugin-camera
* ionic plugin add cordova-plugin-splashscreen
* ionic plugin add https://github.com/ghenry22/cordova-chromecast.git
* android update project --subprojects --path "platforms/android" --target android-25 --library "CordovaLib" 
* ionic build android

###Deploy
* set android phone in develop mode 
* ionic run android

###Setup Receiver App
* Get a Chromecast device and get it set up for development: https://developers.google.com/cast/docs/developers#Get_started
* Register an application on the Developers Console (http://cast.google.com/publish). Select the Custom Receiver option and specify the URL to where you are hosting the receiver index.html file
* Insert your App ID in the src/providers/chromecast.ts file
* Copy index.html from receiver to your own server

### License
See LICENSE



