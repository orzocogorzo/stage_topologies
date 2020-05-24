const Mustache = require("mustache");


const TimeControl = (function () {

    var intervalRwd, intervalFwd;

    const template = `<div class="time-control-wrapper">
        <div class="controls">
            <button class="play" data-icon="P" aria-label="play pause toggle"></button>
            <button class="stop" data-icon="S" aria-label="stop"></button>
            <div class="timer">
            <div></div>
            <span aria-label="timer">00:00</span>
            </div>
            <button class="rwd" data-icon="B" aria-label="rewind"></button>
            <button class="fwd" data-icon="F" aria-label="fast forward"></button>
        </div>
    </div>`;

    const TimeControl = function TimeControl (el, video, drawer) {
        const self = this;
        this.el = el;
        this.video = video;
        this.drawer = drawer;
        this.drawer.on("backward", function (ev) {
            self.video.media.pause();
            self.video.media.currentTime = ev.detail.time;
        });
    }

    TimeControl.prototype.render = function render () {
        const self = this;

        this.el.innerHTML = Mustache.render(template, this.data);

        this.play = this.el.querySelector(".play");
        this.play.addEventListener("click", this.playPause.bind(this));
        this.stop = this.el.querySelector(".stop");
        this.stop.addEventListener('click', this.stopMedia.bind(this));
        this.video.media.addEventListener('ended', this.stopMedia.bind(this));
        this.rwd = this.el.querySelector(".rwd");
        this.fwd = this.el.querySelector(".fwd");
        this.rwd.addEventListener('click', this.mediaBackward.bind(this));
        this.fwd.addEventListener('click', this.mediaForward.bind(this));
        this.timerWrapper = this.el.querySelector(".timer");
        this.timer = this.el.querySelector(".timer span");
        this.timerBar = this.el.querySelector(".timer div");

        document.addEventListener("keypress", function (ev) {
            if (ev.charCode == 32) {
                self.playPause.call(self);
            }
        });

        this.video.media.addEventListener('timeupdate', this.setTime.bind(this));
    }

    TimeControl.prototype.playPause = function playPause (ev) {
        if (this.video.media.paused) {
            this.video.media.play();
        } else {
            this.video.media.pause();
        }
    }

    TimeControl.prototype.stopMedia = function stopMedia () {
        this.video.media.pause();
        this.video.media.currentTime = 0;
        this.play.setAttribute('data-icon','P');
        this.rwd.classList.remove('active');
        this.fwd.classList.remove('active');
        clearInterval(intervalRwd);
        clearInterval(intervalFwd);
    }

    TimeControl.prototype.mediaBackward = function mediaBackward () {
        clearInterval(intervalFwd);
        this.fwd.classList.remove('active');
      
        if(this.rwd.classList.contains('active')) {
          this.rwd.classList.remove('active');
          clearInterval(intervalRwd);
          this.video.media.play();
        } else {
          this.rwd.classList.add('active');
          this.video.media.pause();
          intervalRwd = setInterval(this.windBackward.bind(this), 200);
        }
    }

    TimeControl.prototype.mediaForward = function mediaForward () {
        clearInterval(intervalRwd);
        this.rwd.classList.remove('active');
      
        if(this.fwd.classList.contains('active')) {
            this.fwd.classList.remove('active');
            clearInterval(intervalFwd);
            this.video.media.play();
        } else {
            this.fwd.classList.add('active');
            this.video.media.pause();
            intervalFwd = setInterval(this.windForward.bind(this), 200);
        }
    }

    TimeControl.prototype.windBackward = function windBackward () {
        if(this.video.media.currentTime <= 10) {
            this.rwd.classList.remove('active');
            clearInterval(intervalRwd);
            this.stopMedia();
        } else {
            this.video.media.currentTime -= 10;
        }
      }
      
    TimeControl.prototype.windForward = function windForward () {
        if(this.video.media.currentTime >= this.video.media.duration - 10) {
            this.fwd.classList.remove('active');
            clearInterval(intervalFwd);
            this.stopMedia();
        } else {
            this.video.media.currentTime += 10;
        }
    }

    TimeControl.prototype.setTime = function setTime () {
        this.currentTime = this.video.media.currentTime;
        this.drawer.setTime(this.currentTime);

        let minutes = Math.floor(this.currentTime / 60);
        let seconds = Math.floor(this.currentTime - minutes * 60);
        let minuteValue;
        let secondValue;

        if (minutes < 10) {
            minuteValue = '0' + minutes;
        } else {
            minuteValue = minutes;
        }

        if (seconds < 10) {
            secondValue = '0' + seconds;
        } else {
            secondValue = seconds;
        }

        let mediaTime = minuteValue + ':' + secondValue;
        this.timer.textContent = mediaTime;

        let barLength = this.timerWrapper.clientWidth * (this.video.media.currentTime / this.video.media.duration);
        this.timerBar.style.width = barLength + 'px';
    }

    return TimeControl;
})();

module.exports = TimeControl;