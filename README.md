# song-number
SongNumber is a small mobile app that will allow user to set a song number from a list of song books and cast it

###Build
* ```sudo npm install -g ionic cordova```
* ```cordova platforms add android```
* ```ionic cordova plugin add cordova-plugin-camera```
* ```npm install --save @ionic-native/camera```
* ```ionic cordova plugin add cordova-plugin-splashscreen```
* ```npm install --save @ionic-native/splash-screen```
* ```ionic cordova plugin add https://github.com/Fl0r14n/cordova-chromecast```
* ```ionic cordova plugin add cordova-plugin-background-mode```
* ```npm install --save @ionic-native/background-mode```
* ```npm install --save @ionic/storage```

if you want to change the api version search for "android-XX" in project where XX is the current version and change it to whatever  android api version you like

* ```ionic cordova resources``` 
* ```ionic build android```

###Deploy

####Android

* set android phone in develop mode
* check if it is visible under ```adb devices``` 
* ```ionic cordova run android```

#### Chrome extension

* ionic cordova build browser
* in Chrome go to chrome://extensions and load unpacked extension from the platforms/browser/www directory.
* if you want it as a pupup just replace app with below in manifest.json and in index.html uncomment popup size then build again
```
"app": {
    "launch": {
      "local_path": "index.html"
    }
  },
```
 with
```
"browser_action": {
    "default_popup": "index.html"
  },
```  


###Setup Receiver App
* Get a Chromecast device and get it set up for development: https://developers.google.com/cast/docs/developers#Get_started
* Register an application on the Developers Console (http://cast.google.com/publish). Select the Custom Receiver option and specify the URL to where you are hosting the receiver index.html file
* Insert your App ID in the src/providers/chromecast.ts file
* Copy index.html from receiver to your own server

### License
See LICENSE



