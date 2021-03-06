# song-number
SongNumber is a small mobile app that will allow user to set a song number from a list of song books and cast it

### Build
* Install global dependencies
  ```sudo npm install -g @ionic/cli cordova-res```
* Build app
  ```ionic build```
* Add deployment platform
  ```npx cap add android```
* Copy build files to platform
  ```npx cap copy```
* Generate assets (icon and splash)
  ```cordova-res android --skip-config --copy```

### Deploy
* Open platform ide for native build. You might need to change path in `capacitor.config.json`
  ```npx cap open```

#### Android
* From android studio build the project and run it on mobile device
* To change the android version edit `./android/app/build.gradle`

### Setup Receiver App

* Get a Chromecast device and get it set up for development: https://developers.google.com/cast/docs/developers#Get_started
* Register an application on the Developers Console (http://cast.google.com/publish). Select the Custom Receiver option and specify the URL to where you are hosting the receiver index.html file
* Insert your App ID in the src/providers/chromecast.ts file
* Copy index.html from receiver to your own server

### License
[GPLv2](LICENSE)
