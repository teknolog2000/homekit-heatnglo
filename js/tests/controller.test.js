var test = require('tape');
var HardwareStub = require('../hardware_stub');
var FireplaceController = require('../controller');

test('instantiate the controller', function (t) {
    t.doesNotThrow(function () {
        FireplaceController.init(HardwareStub);
    }, 'init succeeds');
    t.end();
});

test('power can be turned on', function (t) {
    t.equals(FireplaceController.getPower(), false, 'power is initially off');
    FireplaceController.setPower(true);
    t.equals(FireplaceController.getPower(), true, 'power is now on');
    t.end();
});

test('power can be turned off', function (t) {
    t.equals(FireplaceController.getPower(), true, 'power is initially on');
    FireplaceController.setPower(false);
    t.equals(FireplaceController.getPower(), false, 'power is now off');
    t.end();
});
