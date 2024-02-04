window.ipcRenderer = require('electron').ipcRenderer;
const uaup = require('./uaup-js/index.js');
const settings = require("../appsettings.json");

window.onload = function() 
{
    const defaultStages = {
            Checking: "Checking...", // When Checking For Updates.
            Found: "Update Found!",  // If an Update is Found.
            NotFound: "No Update Found.", // If an Update is Not Found.
            Downloading: "Downloading...", // When Downloading Update.
            Unzipping: "Installing...", // When Unzipping the Archive into the Application Directory.
            Cleaning: "Finalizing...", // When Removing Temp Directories and Files (ex: update archive and tmp directory).
            Launch: "Launching..." // When Launching the Application.
        };
    const updateOptions = {gitRepo: settings.AppUrl,gitUsername: "TestUser",appName: "edara_app_win64", appExecutableName: "Edara.exe", stageTitles: defaultStages,currentVersion: settings.Version ,latestVersion: settings.AppUrl+'electron_version.json'};
    uaup.CheckForUpdates(updateOptions)
    .then((isUpdateAvalible) =>
    {
        if(isUpdateAvalible)
        {
            document.write
            (`
                <!DOCTYPE html>
                <html lang="en">

                <head>
                    <style>
                        body{
                            background: #1a1a1a;
                            color: white;
                        }
                        
                        #control{
                            -webkit-app-region: drag;
                            width: 100%;
                            height: 100vh;
                            z-index: 99;
                            top: 0;
                            left: 0;
                            position: absolute;
                            background: transparent;
                        }
                        
                        #download{
                            position: absolute;
                            bottom: 15px;
                            width: 80%;
                            left: 10%;
                            height: 25px;
                        }
                        
                        #download-label{
                            position: absolute;
                            top: 20vh;
                            width: 97%;
                            text-align: center;
                            font-size: 48px;
                            font-family: 'Montserrat', sans-serif;
                            font-weight: 300;
                        }
                    </style>
                    <link rel="preconnect" href="https://fonts.gstatic.com">
                    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300&display=swap" rel="stylesheet">
                </head>

                <body>

                    <div id="control"></div>

                    <label for="download" id="download-label"></label>

                    <progress id="download" max="100" value="0"></progress>

                </body>

                </html>
            `);

            updateOptions.progressBar =  document.getElementById("download"), // {Default is null} [Optional] If Using Electron with a HTML Progressbar, use that element here, otherwise ignore
            updateOptions.label=  document.getElementById("download-label"), // {Default is null} [Optional] If Using Electron, this will be the area where we put status updates using InnerHTML
            uaup.Update(updateOptions);
        }
    }); 
};