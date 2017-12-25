var test = require('tape');
var FirePlaceController = require('../controller.js');

test('timing test', function (t) {
    t.plan(2);

    t.equal(typeof Date.now, 'function');
    var start = Date.now();

    setTimeout(function () {
        t.equal(Date.now() - start, 100);
    }, 100);
});

test('should return -1 when the value is not present in Array', function (t) {
    t.equal(-1, [1, 2, 3].indexOf(4)); // 4 is not present in this array so passes
    t.end();
});

