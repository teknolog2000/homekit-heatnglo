var HardwareStub = require('./hardware_stub');
var HardwareReal = require('./hardware_real');

var FireplaceController = {
    name: "Fireplace",
    username: "1B:2B:3C:4D:5E:FF",
    pincode: "031-45-154",
    manufacturer: "Heat & Glo",
    model: "1.0",
    serialNumber: "0",
    MAX_FLAME: 4,
    MAX_FAN: 4,
    _powerOn: false,
    _fanSpeed: 0,
    _flameSize: 0,
    _hardware: HardwareStub, //_hardware: HardwareReal,
    init: function () {
        this._hardware.init();
    },
    identify: function () {
        console.log("Identify the '%s'", this.name);
    },
    setPower: function (on) {
        console.log("setPower");

        if (on == this._powerOn) {
            return;
        }

        this._hardware.togglePower();
        this._powerOn = on;
    },
    getPower: function () {
        return this._powerOn;
    },
    setFan: function (speed) {
        console.log("setFan");

        if (speed == this._fanSpeed) {
            return;
        }

        var toggles = speed - this._fanSpeed;
        if (toggles < 0) {
            toggles += this.MAX_FAN;
        }

        for (var i = 0; i < toggles; i++) {
            this._hardware.toggleFan();
        }

        this._fanSpeed = speed;
    },
    getFan: function () {
        console.log("getFan");

        if (!this._powerOn) {
            return 0;
        }

        return this._fanSpeed;
    },
    setFlame: function (size) {
        console.log("setFlame");

        if (size == this._flameSize) {
            return;
        }

        // ensure power is the right 
        this.setPower(size > 0);

        if (size > 0) {
            // JS doesn't have a proper modulo operator
            var toggles = size - this._flameSize;
            if (toggles < 0) {
                toggles += this.MAX_FLAME;
            }

            for (var i = 0; i < toggles; i++) {
                this._hardware.toggleFlame();
            }
        }
        this._flameSize = size;
    },
    getFlame: function () {
        console.log("getFlame");
        if (!this._powerOn) {
            return 0;
        }

        return this._flameSize;
    },
};

module.exports = FireplaceController;