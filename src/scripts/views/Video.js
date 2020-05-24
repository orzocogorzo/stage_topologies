const Mustache = require("mustache");


const VideoView = (function () {

    const template = `<div class="video-wrapper">
        <div id="dropSurface">Arrosega el video aquí</div>
        <div id="videoPlayer">
            <video autobuffer="autobuffer">
                Sorry, your browser doesn't support embedded videos.
            </video>
        </div>
    </div>`;

    const VideoView = function Video (el) {
        this.el = el;
        window.addEventListener("resize", this.onResize(this));
    }

    VideoView.prototype.render = function render () {
        const self = this;

        this.el.innerHTML = Mustache.render(template, this.data);
        this.media = self.el.querySelector("video");
        this.media.width = 0;

        const dropSurface = this.el.querySelector("#dropSurface");

        dropSurface.addEventListener("dragover", function (ev) {
            ev.preventDefault();
        });
        
        dropSurface.addEventListener("drop", function (ev) {
            ev.preventDefault();
            const file = ev.dataTransfer.files[0];
            if (file) document.getElementById("content").setAttribute("ready", "true");
            self.media.width = self.el.offsetWidth;
            const source = document.createElement("source");
            source.src = URL.createObjectURL(file);
            self.media.appendChild(source);
            self.media.load();
            document.getElementById("content").setAttribute("ready", "true");
            self.el.dispatchEvent(new CustomEvent("uploaded", {
                details: "custom data"
            }));
        });
    }

    VideoView.prototype.onResize = function onResize (ctxt) {
        var self = ctxt;
        var pending;

        function _onResize () {
            const parent = self.media.parentElement;
            parent.removeChild(self.media);
            self.media.width = self.el.offsetWidth;
            parent.appendChild(self.media);
        }

        return function (ev) {
            clearTimeout(pending);
            pending = setTimeout(_onResize, 150);
        }
    }

    VideoView.prototype.togglePlay = function togglePlay () {
        if (this.media.paused) {
            this.media.play();
        } else {
            this.media.pause();
        }
    }

    VideoView.prototype.on = function on (ev, callback) {
        this.el.addEventListener(ev, callback);
    }

    return VideoView;
})();

module.exports = VideoView;