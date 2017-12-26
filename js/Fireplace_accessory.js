var Accessory = require('../').Accessory;
var Service = require('../').Service;
var Characteristic = require('../').Characteristic;
var uuid = require('../').uuid;
var HardwareReal = require('./hardware_real');
var FireplaceController = require('./controller');

// create the HAP-NodeJS Accessory
var UUID = uuid.generate('hap-nodejs:accessories:fireplace' + FireplaceController.name);
var fireplaceAccessory = exports.accessory = new Accessory('Fireplace', UUID);

FireplaceController.init(HardwareReal);

// add properties for publishing
fireplaceAccessory.username = FireplaceController.username;
fireplaceAccessory.pincode = FireplaceController.pincode;

// set some basic properties
fireplaceAccessory
  .getService(Service.AccessoryInformation)
  .setCharacteristic(Characteristic.Manufacturer, FireplaceController.manufacturer)
  .setCharacteristic(Characteristic.Model, FireplaceController.model)
  .setCharacteristic(Characteristic.SerialNumber, FireplaceController.serialNumber);

var switchService = fireplaceAccessory.addService(Service.Switch, "Fireplace");
switchService.getCharacteristic(Characteristic.On)
  .on('set', function (value, callback) {
    FireplaceController.setPower(value);
    callback();
  })
  .on('get', function (callback) {
    callback(null, FireplaceController.getPower());
  });

fireplaceAccessory.setPrimaryService(switchService);

// var flameService = fireplaceAccessory.addService(Service.Lightbulb, "Flame");
// flameService.getCharacteristic(Characteristic.On)
//   .on('set', function(value, callback) {
//     FireplaceController.setPower(value);
//     callback();
//   })
//   .on('get', function(callback) {
//       callback(null, FireplaceController.getPower());
//   });

// flameService
//   .addCharacteristic(Characteristic.Brightness)
//   .setProps({
//     minValue: 0,
//     maxValue: 4,
//     minStep: 1
//   })
//   .on('set', function(value, callback) {
//     FireplaceController.setFlame(value);
//     callback();
//   })
//   .on('get', function(callback) {
//     callback(null, FireplaceController._flameSize);
//   });

// var fanService = fireplaceAccessory.addService(Service.Fan, "Fan");
// fanService.getCharacteristic(Characteristic.On)
//   .on('set', function(value, callback) {
//     FireplaceController.setFan(value);
//     callback();
//   })
//   .on('get', function(callback) {
//       callback(null, FireplaceController.getFan());
//   });

// fanService.addCharacteristic(Characteristic.RotationSpeed)
//   .setProps({
//     minValue: 0,
//     maxValue: 4,
//     minStep: 1
//   })
//   .on('set', function(value, callback) {
//     FireplaceController.setFan(value);
//     callback();
//   })
//   .on('get', function(callback) {
//     callback(null, FireplaceController.getFan());
//   });

// fireplaceAccessory.setPrimaryService(flameService);
