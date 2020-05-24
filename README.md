# DevLite

My lightly development boilerplate

## Setup

1. Clone the reposotiry to a new folder
2. Define your working environments
2. Make a dir build in the root directory and define as build environment as you need
3. Install project dependencies with npm/yarn install
4. Write your code on the src folder
5. Build your project

### Git clone

Copy the URI ```git@github.com:orzocogorzo/devlite.git``` to the clipboard and then, with the command ```git clone {{URI}} {{path/to/the/directory}}``` clone the source code to your local.
Once you have the source code on your computed you should remove the **.git** folder on your directory to clean the boilerplate git history and start a new one by your own.

### Environments

In the file **envs.js** is where you should define your client environments.

Each environment is declared following the next convention:

```javascrpt
module.exports = {
    dev: {
        name: 'development',
        host: 'localhost',
        port: 8050,
        apiURL: 'http://localhost:8050/statics/data/',
        staticURL: 'http://localhost:8050/statics/'
    }
}
```

The **envs.js** is a javascript module that exports an object with as environments declareds as you need on the client depending on the environment towards you are compiling the app. The key of each environment is the the alias that will match with the build files info. Inside each environment object there are 5 keys you must fill:

1. **name** is the complete name of the environment. 
2. **host** the host where the app will be placed.
3. **port** the port where the app will be exposed.
4. **apiURL** the path where the app will have their REST API.
5. **staticURL** the path where the app will find their statics.

To this 5 required keys you can add more information to be consulted on runtime.

### Build files

Declare one build file for each deploy environment your project you has, from the develop on the localhost to the remote production environment.

This files are affected by two conventions:

1. The file name follows the format:

```build.{{environment_alias}}.js```

2. The file contents follows the format:

```javascript
module.exports = {
    dist: '/statics/client/',
    env: 'dev'
}
```

You must declare an object as the module.exports with two keys:

1. **statics**: Where the bundle file has to be deployed
2. **env**: The name of the current environment

There are three default environments (that can be overwriteds): 

1. **pro** for the production deploy environment.
2. **pre** for the preproduction deploy environment.
3. **dev** for the local deploy for development.

### Dependencies

If your project has npm dependencies you may install it with the client of your preference (npm/yarn) on the project saving it in the packages.json index.

### Src folder

Your code must be placed inside the **src** folder. Inside the folder you must find three more folders and the **index.html**. The html file is the index where your bundle will be loaded. The **statics** is where static files and others must be placed and referenced from your code. The **styles** is the folder where all your styling code must be placed and referenced from your code. Ath the end, inside **scripts** folder is where your javascript code will be placed.

### Build

Inside the package.json comes defined three scripts by default as three ways to build your project:

1. **serve** for setup the project in development mode.
2. **build:pre** to build the project with the pre as the active environment
3. **build:pro** to build the project with the pro as the active environment

