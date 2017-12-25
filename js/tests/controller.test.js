var test = require('tape');
var FireplaceController = require('../controller.js').FireplaceController;

test('instantiate the controller', function (t) {
    t.doesNotThrow(function () {
        console.log(FireplaceController);
        FireplaceController.init();
    });
    t.end();
});
