const VideoView = require("./views/Video.js");
const DrawerView = require("./views/Drawer.js");
const TimeControl = require("./components/TimeControl.js");


module.exports = function startApp () {
    const content = document.getElementById("content")
    content.setAttribute("ready", "false");
    content.innerHTML = `<div class="content-wrapper">
        <div id="video"></div>
        <div id="drawer"></div>
        <div id="timeControl"></div>
    </div>`;

    const videoView = new VideoView(document.getElementById("video"));
    videoView.render();
    const drawerView = new DrawerView(document.getElementById("drawer"));
    drawerView.render();

    const timeControl = new TimeControl(
        document.getElementById("timeControl"),
        videoView,
        drawerView
    );

    videoView.on("uploaded", function () {
        timeControl.render();
    });

}