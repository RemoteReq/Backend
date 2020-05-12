# RemoteReq template repo    
[![Build Status](https://travis-ci.org/RemoteReq/Template.svg?branch=master)](https://travis-ci.org/RemoteReq/Template)

In this Repo you'll find all the neccessary software needed to develop features and tools for RemoteReq. 

This repo comes bundled with tooling for CI/CD and testing. 

What's also neat is that this markdown also comes with a badge to show whether or not the repo builds successfully or not! It will save you the headache for deploying later on.

# npm scripts:

- `server` 
  - will start up the app on a Node-Express server to server the dist folder after building in Webpack's production mode. It also serves as the backend that will handle API requests

- `build:dev`
  - uses `webpack-dev-server` to run the app in memory and enables `hot module reloading` to automatically refresh the application and display graphical changes in real time. 
    - I'm unsure if this preserves state or not. But we'll see

- `build:pro`
  - compliles and outputs the application into a `dist` folder that includes a `bundle.js` and appropriately tagged `index.html` file. This folder is then served by the express server.

- `dockerize`
  - a script that automates the docker build and run commands. It's configured to run and map the app from port 3030 of `server.js` to a desired port.

    - ### Remember to change the following values before you dockerize!
      - `-t` to an appropiate tag name
      - `--name` to an appropriate image name
      - `-d` to the corresponding image name
      - `p xxxx:3030` to an unoccupied port

# Gotchas:

  - If you run into any issues trying to dockerize this application, check to see if the `dockerize` script is trying to map to already occupied port.