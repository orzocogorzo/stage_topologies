// const Mustache = require("mustache");

const DrawerHeader = require("../components/DrawerHeader.js");


const Drawer = (function () {

    const template = `<div class="drawer-wrapper">
        <div class="drawer-header"></div>
        <div class="drawer-content">
            <canvas id="drawerCanvas"></canvas>
        </div>
    </div>`;

    const Drawer = function Drawer (el) {
        this.el = el;
        this.currentTime = 0;
        this.history = new Array();
        window.addEventListener("resize", this.onResize(this));
    }

    Drawer.prototype.render = function render () {
        const self = this;
        this.el.innerHTML = template;

        this.header = new DrawerHeader(this.el.querySelector(".drawer-header"));
        this.header.render();

        this.header.on("select", function (ev) {
            self.selected = ev.detail.id;
            self.draw();
        });

        this.header.on("backward", this.onBackward.bind(this));

        this.canvas = this.el.querySelector("#drawerCanvas");
        this.addNewRecord = this.addNewRecord.bind(this);
        this.canvas.addEventListener("click", this.addNewRecord);
        this.ctxt = this.canvas.getContext('2d');

        this.draw();
    }

    Drawer.prototype.draw = function draw () {
        const self = this;
        this.canvas.width = this.el.offsetWidth - 50;
        this.canvas.height = (this.el.offsetWidth - 50) * 0.75;
        this.ctxt.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctxt.fillStyle = 'rgba(0, 0, 0, .1)';
        this.ctxt.beginPath();
        this.ctxt.moveTo(1, 1);
        this.ctxt.lineTo(...this.scale(99, 1));
        this.ctxt.lineTo(...this.scale(99, 99));
        this.ctxt.lineTo(...this.scale(1, 99));
        this.ctxt.lineTo(1, 1);
        this.ctxt.fill();

        const data = this.data();
        for (let player of data) {
            player.positions.map(function (rec, i) {
                if (i == 0) {
                    self.ctxt.beginPath();
                    self.ctxt.moveTo(rec.x * self.canvas.width, rec.y * self.canvas.height);
                } else {
                    self.ctxt.strokeStyle = player.color + (self.selected == player.id ? "ff" : "33"); //  + parseInt(Math.pow((i + 1) / player.positions.length, 5) * 255).toString(16)
                    self.ctxt.lineTo(rec.x * self.canvas.width, rec.y * self.canvas.height);
                }
            });
            this.ctxt.stroke();
        }
    }

    Drawer.prototype.setTime = function setTime (time) {
        this.currentTime = time;
        this.draw();
    }

    Drawer.prototype.data = function data () {
        const self = this;
        return self.header.players.reduce(function (acum, player, i) {
            acum.push({
                id: player.id,
                name: player.name,
                color: player.color
            });
            acum[i].positions = player.positions.filter((rec) => rec.time <= self.currentTime);
            return acum;
        }, new Array());
    }

    Drawer.prototype.onResize = function onResize (ctxt) {
        var self = ctxt;
        var pending;

        function _onResize () {
            const parent = self.canvas.parentElement;
            parent.removeChild(self.canvas);
            self.canvas.width = self.el.offsetWidth - 50;
            self.canvas.height = (self.el.offsetWidth - 50) * 0.75;
            parent.appendChild(self.canvas);
        }

        return function (ev) {
            clearTimeout(pending);
            pending = setTimeout(_onResize, 150);
        }
    }

    Drawer.prototype.scale = function scale (x, y) {
        return [
            (this.el.offsetWidth - 50) * x + 25,
            (this.el.offsetWidth - 50) * .75 * y
        ];
    }

    Drawer.prototype.addNewRecord = function addNewRecord (ev) {
        if (!this.selected) return;
        const player = this.header.players.filter(player => player.id == this.selected)[0];
        player.positions.push({
            time: this.currentTime,
            x: (ev.pageX - this.canvas.offsetLeft + this.canvas.clientLeft) / this.canvas.width,
            y: (ev.pageY - this.canvas.offsetTop + this.canvas.clientTop) / this.canvas.height
        });
        this.history.push({
            id: player.id,
            time: this.currentTime
        });
        this.draw();
    }

    Drawer.prototype.onBackward = function onBackward () {
        const last_state = this.history.pop();
        const player = this.header.players.filter(player => player.id == last_state.id)[0];
        player.positions.pop();
        this.draw();
        this.el.dispatchEvent(new CustomEvent("backward", {
            detail: last_state
        }));
    }

    Drawer.prototype.on = function on (ev, callback) {
        this.el.addEventListener(ev, callback);
    }

    return Drawer;
})();

module.exports = Drawer;