# song-number
SongNumber is a small mobile app that will allow user to set a song number from a list of song books and cast it

###Build
1) sudo npm install -g ionic2 cordova@6.3.0
2) cordova platforms add android
3) android update project --subprojects --path "platforms/android" --target android-25 --library "CordovaLib"
4) change connect sdk android build-extends.gradle set versions:
  compileSdkVersion 25
  buildToolsVersion '25.0.2'
  useLibrary  'org.apache.http.legacy'
5) ionic build android

###Deploy
1) set android phone in develop mode 
2) ionic run android
