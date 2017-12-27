var rpio = require('rpio');

var Hardware = function () {
    this.Pins = {
        PIN_ONOFF: 31,
        PIN_FAN: 33,
        PIN_FLAME: 35,
        PIN_PILOT: 37
    };

    this._blipPin = function (pin) {
        rpio.sleep(0.5);
        console.log("setting pin " + pin + " high");
        rpio.write(pin, rpio.HIGH);
        rpio.sleep(0.5);
        console.log("setting pin " + pin + " low");
        rpio.write(pin, rpio.LOW);
    };

    console.log("HardwareImplementation init");
    rpio.open(this.Pins.PIN_ONOFF, rpio.OUTPUT, rpio.LOW);
    rpio.open(this.Pins.PIN_FAN, rpio.OUTPUT, rpio.LOW);
    rpio.open(this.Pins.PIN_FLAME, rpio.OUTPUT, rpio.LOW);
    rpio.open(this.Pins.PIN_PILOT, rpio.OUTPUT, rpio.LOW);

    this.togglePower = function () {
        console.log("HardwareImplementation togglePower");
        this._blipPin(this.Pins.PIN_ONOFF);
    };

    this.toggleFan = function () {
        console.log("HardwareImplementation toggleFan");
        this._blipPin(this.Pins.PIN_FAN);
    };

    this.toggleFlame = function () {
        console.log("HardwareImplementation toggleFlame");
        this._blipPin(this.Pins.PIN_FLAME);
    };
};

module.exports = Hardware;