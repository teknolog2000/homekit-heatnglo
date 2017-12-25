var test = require('tape');
var FireplaceController = require('../controller.js').FireplaceController;

test('instantiate the controller', function (t) {
    t.doesNotThrow(function () {
        FireplaceController.init();
    });
    t.end();
});
