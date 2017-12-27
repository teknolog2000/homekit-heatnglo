var Accessory = require('../').Accessory;
var Service = require('../').Service;
var Characteristic = require('../').Characteristic;
var uuid = require('../').uuid;
//var Hardware = require('./hardware');
var FireplaceController = require('./controller');

console.log('Loading Fireplace accessory');

// create the HAP-NodeJS Accessory
var UUID = uuid.generate('hap-nodejs:accessories:fireplace');
var fireplaceAccessory = exports.accessory = new Accessory('Fireplace', UUID);

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

var fireplaceController = new FireplaceController(new HardwareStub());

// add properties for publishing
fireplaceAccessory.username = "1B:2B:3C:4D:5E:FF";
fireplaceAccessory.pincode = "031-45-154";

// set some basic properties
fireplaceAccessory
    .getService(Service.AccessoryInformation)
    .setCharacteristic(Characteristic.Manufacturer, "Heat & Glo")
    .setCharacteristic(Characteristic.Model, "1.0")
    .setCharacteristic(Characteristic.SerialNumber, "0");

//
// Power on/off exposed as a switch
//
var switchService = fireplaceAccessory.addService(Service.Switch, "Fireplace");
switchService.getCharacteristic(Characteristic.On)
    .on('set', function (value, callback) {
        fireplaceController.setPower(value);
        callback();
    })
    .on('get', function (callback) {
        callback(null, fireplaceController.getPower());
    });

fireplaceAccessory.setPrimaryService(switchService);

//
// Flame height exposed as a lightbulb with adjustable brightness
//
var flameService = fireplaceAccessory.addService(Service.Lightbulb, "Flame");
flameService.getCharacteristic(Characteristic.On)
    .on('set', function (value, callback) {
        fireplaceController.setPower(value);
        callback();
    })
    .on('get', function (callback) {
        callback(null, fireplaceController.getPower());
    });

flameService
    .addCharacteristic(Characteristic.Brightness)
    .setProps({
        minValue: 0,
        maxValue: 4,
        minStep: 1
    })
    .on('set', function (value, callback) {
        fireplaceController.setFlame(value);
        callback();
    })
    .on('get', function (callback) {
        callback(null, fireplaceController._flameSize);
    });

//
// Fan speed exposed as a... fan
//
var fanService = fireplaceAccessory.addService(Service.Fan, "Fan");
fanService.getCharacteristic(Characteristic.On)
    .on('set', function (value, callback) {
        fireplaceController.setFan(value);
        callback();
    })
    .on('get', function (callback) {
        callback(null, fireplaceController.getFan());
    });

fanService.addCharacteristic(Characteristic.RotationSpeed)
    .setProps({
        minValue: 0,
        maxValue: 4,
        minStep: 1
    })
    .on('set', function (value, callback) {
        fireplaceController.setFan(value);
        callback();
    })
    .on('get', function (callback) {
        callback(null, fireplaceController.getFan());
    });
