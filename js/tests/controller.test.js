var test = require('tape');
var FireplaceController = require('../controller');

var HardwareStub = function () {
    this._powerToggles = 0;
    this._fanToggles = 0;
    this._flameToggles = 0;

    this.togglePower = function () {
        this._powerToggles += 1;
    };

    this.toggleFan = function () {
        this._fanToggles += 1;
    };

    this.toggleFlame = function () {
        this._flameToggles += 1;
    };
};

// power tests

test('power can be turned on and off', function (t) {
    var fc = new FireplaceController(new HardwareStub());

    t.equals(fc.getPower(), false, 'power is initially off');
    t.equals(fc.setPower(true), true, 'power set to on');
    t.equals(fc.getPower(), true, 'power is now on');
    t.equals(fc.setPower(false), true, 'power set to off');
    t.equals(fc.getPower(), false, 'power is now off');
    t.end();
});

// fan tests

test('fan can not be set unless power is on', function (t) {
    var stub = new HardwareStub();
    var fc = new FireplaceController(stub);

    t.equals(fc.getPower(), false, 'power is off');
    t.equals(fc.getFan(), 0, 'fan is initially at 0');
    t.equals(fc.setFan(3), false, 'fan can not be set');
    t.equals(stub._fanToggles, 0, 'fan HW toggled 0 times');
    t.equals(fc.getFan(), 0, 'fan is still at 0');

    t.end();
});

test('fan can be set when power is turned on', function (t) {
    var stub = new HardwareStub();
    var fc = new FireplaceController(stub);

    t.equals(fc.getPower(), false, 'power is off');
    t.equals(fc.setPower(true), true, 'power can be turned on');
    t.equals(fc.getFan(), 0, 'fan is initially at 0');
    t.equals(fc.setFan(3), true, 'fan set to 3');
    t.equals(stub._fanToggles, 3, 'fan HW toggled 3 times');
    t.equals(fc.getFan(), 3, 'fan is now at 3');

    t.end();
});

test('fan can not be set higher than MAX_FAN', function (t) {
    var stub = new HardwareStub();
    var fc = new FireplaceController(stub);

    t.equals(fc.getPower(), false, 'power is off');
    t.equals(fc.setPower(true), true, 'power can be turned on');
    t.equals(fc.getFan(), 0, 'fan is initially at 0');
    t.equals(fc.setFan(fc.MAX_FAN + 1), false, 'fan can not be set higher than MAX_FAN');
    t.equals(stub._fanToggles, 0, 'fan HW toggled 0 times');
    t.equals(fc.getFan(), 0, 'fan is still at 0');

    t.end();
});

test('fan toggles wraps around MAX_FAN when level is decreased', function (t) {
    var stub = new HardwareStub();
    var fc = new FireplaceController(stub);

    t.equals(fc.getPower(), false, 'power is off');
    t.equals(fc.setPower(true), true, 'power can be turned on');
    t.equals(fc.getFan(), 0, 'fan is initially at 0');
    t.equals(fc.setFan(3), true, 'fan set to 3');
    t.equals(stub._fanToggles, 3, 'fan HW toggled 3 times total');
    t.equals(fc.setFan(1), true, 'fan set to 1');
    t.equals(stub._fanToggles, 5, 'fan HW toggled 5 times total (3 -> 1)');
    t.equals(fc.getFan(), 1, 'fan is now at 1');

    t.end();
});

// flame tests

test('flame can not be set unless power is on', function (t) {
    var stub = new HardwareStub();
    var fc = new FireplaceController(stub);

    t.equals(fc.getPower(), false, 'power is off');
    t.equals(fc.getFlame(), 0, 'flame is initially at 0');
    t.equals(fc.setFlame(3), false, 'flame can not be set');
    t.equals(stub._flameToggles, 0, 'flame HW toggled 0 times');
    t.equals(fc.getFlame(), 0, 'flame is still at 0');

    t.end();
});

test('flame can be set when power is turned on', function (t) {
    var stub = new HardwareStub();
    var fc = new FireplaceController(stub);


    t.equals(fc.getPower(), false, 'power is off');
    t.equals(fc.setPower(true), true, 'power can be turned on');
    t.equals(fc.getFlame(), 1, 'flame is initially at 1');
    t.equals(fc.setFlame(3), true, 'flame set to 3');
    t.equals(stub._flameToggles, 2, 'flame HW toggled 2 times');
    t.equals(fc.getFlame(), 3, 'flame is now at 3');

    t.end();
});

test('flamE can not be set higher than MAX_FLAME', function (t) {
    var stub = new HardwareStub();
    var fc = new FireplaceController(stub);

    t.equals(fc.getPower(), false, 'power is off');
    t.equals(fc.setPower(true), true, 'power can be turned on');
    t.equals(fc.getFlame(), 1, 'flame is initially at 1');
    t.equals(fc.setFlame(fc.MAX_FLAME + 1), false, 'flame can not be set higher than MAX_FLAME');
    t.equals(stub._flameToggles, 0, 'flame HW toggled 0 times');
    t.equals(fc.getFlame(), 1, 'flame is still at 1');

    t.end();
});

test('flamE can not be set to zero', function (t) {
    var stub = new HardwareStub();
    var fc = new FireplaceController(stub);

    t.equals(fc.getPower(), false, 'power is off');
    t.equals(fc.getFlame(), 0, 'flame is at 0 when power is off');
    t.equals(fc.setPower(true), true, 'power can be turned on');
    t.equals(fc.getFlame(), 1, 'flame is now at 1');
    t.equals(fc.setFlame(0), false, 'flame can not be set to zero');
    t.equals(stub._flameToggles, 0, 'flame HW toggled 0 times');
    t.equals(fc.getFlame(), 1, 'flame is still at 1');

    t.end();
});

test('flame toggles wraps around MAX_FLAME when level is decreased', function (t) {
    var stub = new HardwareStub();
    var fc = new FireplaceController(stub);

    t.equals(fc.getPower(), false, 'power is off');
    t.equals(fc.setPower(true), true, 'power can be turned on');
    t.equals(fc.getFlame(), 1, 'flame is initially at 1');
    t.equals(fc.setFlame(3), true, 'flame set to 3');
    t.equals(stub._flameToggles, 2, 'flame HW toggled 2 times total');
    t.equals(fc.setFlame(1), true, 'flame set to 1');
    t.equals(stub._flameToggles, 3, 'flame HW toggled 3 times total (3 -> 1)');
    t.equals(fc.getFlame(), 1, 'flame is now at 1');

    t.end();
});

