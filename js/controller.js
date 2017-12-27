var FireplaceController = function (hardware) {
    this.name = "Fireplace";
    this.username = "1B:2B:3C:4D:5E:FF";
    this.pincode = "031-45-154";
    this.manufacturer = "Heat & Glo";
    this.model = "1.0";
    this.serialNumber = "0";
    this.MAX_FLAME = 3;
    this.MAX_FAN = 3;
    this._powerOn = false;
    this._fanSpeed = 0;
    this._flameSize = 1; // flame can't be zero (unless power is off)
    this._hardware = null;

    if (!hardware) {
        throw 'No hardware implementation provided!';
    }

    this._hardware = hardware;

    this.setPower = function (on) {
        console.log("setPower");

        if (on == this._powerOn) {
            return true;
        }

        this._hardware.togglePower();
        this._powerOn = on;

        return true;
    };

    this.getPower = function () {
        return this._powerOn;
    };

    this.setFan = function (speed) {
        console.log("setFan");

        if (!this._powerOn) {
            return false;
        }

        if (speed == this._fanSpeed) {
            return true;
        }

        if (speed > this.MAX_FAN) {
            return false;
        }

        var toggles = speed - this._fanSpeed;
        if (toggles < 0) {
            toggles += this.MAX_FAN + 1; // +1 because fan has a 0 = off mode
        }

        for (var i = 0; i < toggles; i++) {
            this._hardware.toggleFan();
        }

        this._fanSpeed = speed;

        return true;
    };

    this.getFan = function () {
        console.log("getFan");

        if (!this._powerOn) {
            return 0;
        }

        return this._fanSpeed;
    };

    this.setFlame = function (flame) {
        console.log("setFlame");

        if (!this._powerOn) {
            return false;
        }

        if (flame == this._flameSize) {
            return true;
        }

        if (flame < 1 || flame > this.MAX_FLAME) {
            return false;
        }

        // JS doesn't have a proper modulo operator
        var toggles = flame - this._flameSize;
        if (toggles < 0) {
            toggles += this.MAX_FLAME;
        }

        for (var i = 0; i < toggles; i++) {
            this._hardware.toggleFlame();
        }

        this._flameSize = flame;

        return true;
    };

    this.getFlame = function () {
        console.log("getFlame");
        if (!this._powerOn) {
            return 0;
        }

        return this._flameSize;
    };
};

module.exports = FireplaceController;