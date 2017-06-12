# Overview

This project is meant to help a Teams developer in two ways.  First, it is meant to show many examples of how an app can integrate into Teams.  Second, it is meant to give a set of patterns, templates, and tools that can be used as a starting point for creating a larger, scalable, more enterprise level bot to work within Teams.  Although this project focuses on creating a robust bot, it does include simples examples of tabs as well as examples of how a bot can give links into these tabs.

# What it is

At a high level, this project is written in Typescript, built to run a Node server, uses Gulp to run its build steps, runs a Typescript linting tool to keep the code uniform, and uses the BotFramework to handle the bot's requests and responses.  This project is designed to be run in VSCode using its debugger in order to leverage breakpoints in Typescript.  Most directories will hold a README file which will describe what the files within that directory do. 

The easiest way to get started is to follow the steps listed in the "Steps to get started running the Bot Emulator".  Once this is complete and running, the easiest way to add your own content is to create a new dialog in src/dialogs by copying one from src/dialogs/examples, change it accordingly, and then instantiate it with the others in the RootDialog.ts.

# General Architecture

Most Typescript files that need to be transpiled (and the bulk of the project) reside in the src directory.  Most files outside of the src directory are static files used as either configuration or for providing static resources to tabs, e.g. images and html.  At build time, Gulp will transpile everything in the src directory and place these transpiled files into a build directory.  Gulp will also move a few static files into this new build directory.  Because of this, it is recommended that nothing be changed by a developer in the build directory.  All changes should be done on the "source" files so rebuilding the project will update the build directory.

# Steps to get started running in the Bot Emulator

Get VSCode:  
* https://code.visualstudio.com/  
* NOTE: When installing, setting "open with" for the file and directory contexts can be helpful

Install Node:  
* https://nodejs.org/en/download/  
* NOTE: This gives you npm  

Install Gulp globally - run:  
* npm install --global gulp

Install the bot Emulator - click on "Bot Framework Emulator (Mac and Windows)":  
* https://docs.botframework.com/en-us/downloads/#navtitle  
* NOTE: make sure to pin the emulator to your task bar because it can sometimes be difficult to find again  

Install Git for windows:  
* https://git-for-windows.github.io/

Clone this repo:  
* git clone https://github.com/OfficeDev/microsoft-teams-template-bot.git  

Get the npm modules - in the microsoft-teams-bot-template directory run:  
* npm install

Open microsoft-teams-bot-template with VSCode  

In VSCode go to the debug tab on the left side (looks like a bug) and click the play button  

Once the code is running you can now connect and chat with the bot using the emulator  
* connect to the default "http://localhost:3978/api/messages" leaving "Microsoft App ID" and "Microsoft App Password" blank

NOTE: Athough not necessary to get running in the Bot Emulator, installing ngrok (or another tunnelling tool) will help to get a locally running instance of this project into Teams:  
* https://ngrok.com/

# Files and Directories

* **.vscode**<br><br>
This directory holds the files used by VSCode to build the project.  The launch.json file is where important environment variables will be stored.

* **luis**<br><br>
This directory holds an example of a json file used to instruct a Luis recognizer for natural language processing.

* **manifest**<br><br>
This directory holds the skeleton of a manifest.json file that can be altered in order sideload this application into a team.

* **public**<br><br>
This directory holds static html, image, and javascript files used by the tabs and bot.  This is not the only public directory that is used for the tabs, though.  This directory holds the html and javascript used for the configuration page of the configurable tab.  The main content of the static and configurable tabs is created dynamically by the code in src/tab/TabSetup.ts or comes from the static files placed in build/src/public/exampleDialogs, which are created at build time based upon the typescript dialogs in src/dialogs/examples.

* **src**<br><br>
This directory holds all of the typescript files, which run the entire application.  These files, at build, are transpiled and their transpiled javascript files are placed in the build directory.

* **test**<br><br>
This is a directory to do two things.  First, it acts as a placeholder to give an example of a place to store tests.  Second, it is a directory that works to keep the directory hierarchy correct when files are moved into the build directory.

* **gulpfile.js**<br><br>
This file defines the tasks that Gulp will run to build the project correctly.  The task to completely build the project is named "build".

* **tsconfig.json**<br><br>
This file configures the Typescript transpiling tool.

* **tslint.json**<br><br>
This file configures the Typescript linting tool.

* **web.config**<br><br>
This file is a skeleton of a web.config file that can be used to upload this project into an Azure application.

# Contributing

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/). For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.
