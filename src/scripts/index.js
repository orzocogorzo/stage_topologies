// VENDOR

// MODULES
const startApp = require('./app.js');


if (document.addEventListener) {
    document.addEventListener("DOMContentLoaded", startApp, false);
} else if (document.attachEvent) {
    document.attachEvent("onreadystatechange", startApp);
} else {
    window.onload = startApp;
}
