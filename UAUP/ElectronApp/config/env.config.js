const { readFile, writeFile } = require("fs");
const { join } = require("path");
const fs = require("fs");
const axios = require('axios');

if (process.argv <= 2) return;
const env = process.argv[2];
const settingsFileName = `environment.${env}.json`;

let appSettingObj = {};

const envFilePath = join("./env", settingsFileName);
const outPath = join("./appsettings.json");

function  onFileOpend(err, data) 
{
  appSettingObj = JSON.parse(data); //now it an object

  //Update Version (1).
  // Step 1: Read the current version from the online file
  const onlineVersionUrl = 'https://raw.githubusercontent.com/momar1981/Electron_AutoUpdate_POCs/main/UAUP/ElectronApp/update/edara_desktop_version.json';
  //const setupFile = `https://raw.githubusercontent.com/momar1981/Electron_AutoUpdate_POCs/main/UAUP/ElectronApp/update/setupfile/${env}/edara_app_win64.zip`;
  const setupFile = 'https://pwa-electron.edara.io/edara_app_win64.zip';
  // Make an HTTP GET request to fetch the online version file
  axios.get(onlineVersionUrl)
  .then((versionData) => 
  {
    // Access the version property
    appSettingObj.Version = versionData.data[`${env}_version`]; /*+ 1*/
    appSettingObj.Environment = env;
    appSettingObj.SetupFile = setupFile;
    
    // Now you can use the online version as needed
    console.log(versionData);
    console.log('appSettingObj.Version:', appSettingObj.Version);
      
    writeFile(outPath, JSON.stringify(appSettingObj), "utf8", function (err) {
      if (err) throw err;
      console.log("complete");
    });

  })
  .catch((error) => {
    console.error('Error fetching version:', error.message);
  });

}

readFile(envFilePath, "utf8", onFileOpend);

process.env.AppEnv = env;
