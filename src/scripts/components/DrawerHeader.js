const Mustache = require("mustache");


const DrawerHeader = (function () {

    const template = `<div class="drawer-header__wrapper">
        <div class="drawer-header__backward">
            <button id="backwardButton"><-</button>
        </div>
        <div class="drawer-header__selector">
            <select id="playersSelector">
                {{#players}}
                    <option style="color: {{color}};" value="{{id}}">{{name}}</option>
                {{/players}}
            </select>
        </div>
        <div class="drawer-header__additor">
            <button id="addButton">Add</button>
            <div class="drawer-header__additor-form">
                <div class="drawer-header__additor-background">
                    <div class="drawer-header__additor-wrapper">
                        <div class="drawer-header__input-wrapper">
                            <label>Defineix un nom per a l'interpret</label>
                            <input class="input" id="playerName" key="name" type="text" placeholder="Nom..." />
                        </div>
                        <div class="drawer-header__input-wrapper">
                            <label>Selecciona un color per a l'interpret</label>
                            <input class="input" id="playerColor" key="color" type="color" />
                        </div>
                        <div class="drawer-header__input-wrapper">
                            <button id="submitPlayer">Guarda</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="drawer-header__download">
            <button id="downloadButton"></button>
            <button id="uploadButton"></button>
        </div>
    </div>`;

    const DrawerHeader = function DrawerHeader (el, players=[]) {
        this.el = el;
        this.players = players;
    }

    DrawerHeader.prototype.render = function render () {
        const self = this;
        this.el.innerHTML = Mustache.render(template, {
            players: this.players
        });

        this.openForm = this.openForm.bind(this);
        this.onClickOut = this.onClickOut.bind(this);
        this.submitPlayer = this.submitPlayer.bind(this);
        this.onSelectPlayer = this.onSelectPlayer.bind(this);
        this.saveData = this.saveData.bind(this);
        this.uploadData = this.uploadData.bind(this);
        this.onBackward = this.onBackward.bind(this);
        this.el.querySelector("#backwardButton").addEventListener("click", this.onBackward);
        this.el.querySelector("#addButton").addEventListener("click", this.openForm);
        this.el.querySelector("#playersSelector").addEventListener("change", this.onSelectPlayer);
        this.el.querySelector("#downloadButton").addEventListener("click", this.saveData);
        this.el.querySelector("#uploadButton").addEventListener("click", this.uploadData);
    }

    DrawerHeader.prototype.on = function on (event, callback) {
        this.el.addEventListener(event, callback);
    }

    DrawerHeader.prototype.submitPlayer = function submitPlayer () {
        this.players.push({
            id: Date.now(),
            positions: [],
            ...Array.apply(null, this.el.querySelectorAll(".input")).reduce(function (acum, input) {
                acum[input.getAttribute("key")] = input.value;
                return acum;
            }, new Object())
        });
        this.el.querySelector(".drawer-header__additor").classList.remove("open-form");
        this.el.querySelector(".drawer-header__additor-background").removeEventListener("click", this.onClickOut);
        this.el.querySelector("#submitPlayer").removeEventListener("click", this.submitPlayer);
        this.render();

        if (this.players.length === 1) {
            this.onSelectPlayer({
                currentTarget: {
                    value: this.players[0].id
                }
            });
        }
    }

    DrawerHeader.prototype.onClickOut = function onClickOut (ev) {
        if (ev.target === ev.currentTarget) {
            this.el.querySelector(".drawer-header__additor").classList.remove("open-form");
            this.el.querySelector(".drawer-header__additor-background").removeEventListener("click", this.onClickOut);
            this.el.querySelector("#submitPlayer").removeEventListener("click", this.submitPlayer);
        }
    }

    DrawerHeader.prototype.openForm = function openForm (ev) {
        ev.currentTarget.parentElement.classList.add("open-form");
        this.el.querySelector(".drawer-header__additor-background").addEventListener("click", this.onClickOut);
        this.el.querySelector("#submitPlayer").addEventListener("click", this.submitPlayer);
    }

    DrawerHeader.prototype.onSelectPlayer = function onSelectPlayer (ev) {
        this.selected = ev.currentTarget.value;
        this.el.dispatchEvent(new CustomEvent("select", {
            detail: {
                id: ev.currentTarget.value
            }
        }));
    }

    DrawerHeader.prototype.saveData = function saveData () {
        const data = JSON.stringify(this.players);
        const file = new Blob([data], {
            type: "application/json"
        });

        const link = document.createElement("a");
        link.href = URL.createObjectURL(file);
        link.setAttribute("target", "_blank");
        link.setAttribute("download", "stage-topologies.json");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    DrawerHeader.prototype.uploadData = function uploadData () {
        const self = this;
        const input = document.createElement("input");
        input.type = "file";
        input.addEventListener("change", function (ev) {
            const reader = new FileReader();
            reader.onload = function (ev) {
                self.players = JSON.parse(ev.currentTarget.result);
                self.render();
            }
            reader.readAsText(ev.currentTarget.files[0]);
        });
        document.body.appendChild(input);
        input.click();
    }

    DrawerHeader.prototype.onBackward = function onBackward () {
        this.el.dispatchEvent(new CustomEvent("backward"));
    }

    return DrawerHeader;
})();

module.exports = DrawerHeader;