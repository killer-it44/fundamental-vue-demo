# Fundamental-Vue demo

This is a small demo app that demonstrates [Fundamental-Vue](https://github.com/SAP/fundamental-vue).

## Features

**Small**
Just ~500kb are fetched over the network for the initial browser load, mostly for Vue itself and the fundamentals components.

**Simple**
To setup: `npm install`
To run the app `node src/main.js`
That's it. The server starts instantly and you can browse the application on http://localhost:8080.

**Simpler**
This app does _not_ require all the bloated tools like Browserify, Webpack, Grunt, Gulp, Rimraf, Ugilfy, Less, Sass, ... - you name it.
_No_ enforcement of _any_ CLIs or tools in order to build, debug etc.
Just develop and run it using plain mechanisms. If load time of the static resources is an issue, feel free to add tools to compile/minify the sources, or introduce lazy load mechanisms e.g. with Require.js. Your choice.
