var Accessory = require('../').Accessory;
var Service = require('../').Service;
var Characteristic = require('../').Characteristic;
var uuid = require('../').uuid;
var rpio = require('rpio');

var DummyImplementation = {
  init: function() {
    console.log("init");
  },
  togglePower: function() {
    console.log("togglePower");
  }
};

var HardwareImplementation = {
  Pins: {
    PIN_ONOFF: 31,
    PIN_FAN: 33,
    PIN_FLAME: 35,
    PIN_PILOT: 37
  },
  init: function() {
    rpio.open(this.Pins.PIN_ONOFF, rpio.OUTPUT, rpio.LOW);
    rpio.open(this.Pins.PIN_FAN, rpio.OUTPUT, rpio.LOW);
    rpio.open(this.Pins.PIN_FLAME, rpio.OUTPUT, rpio.LOW);
    rpio.open(this.Pins.PIN_PILOT, rpio.OUTPUT, rpio.LOW);
  },
  togglePower: function() {
    console.log("setting pin high");
    rpio.write(this.Pins.PIN_ONOFF, rpio.HIGH);
    rpio.sleep(1);
    console.log("setting pin low");
    rpio.write(this.Pins.PIN_ONOFF, rpio.LOW);
  }
};

var FireplaceController = {
  name: "Fireplace",
  username: "1B:2B:3C:4D:5E:FF",
  pincode: "031-45-154",
  manufacturer: "Heat & Glo",
  model: "1.0",
  serialNumber: "0",
  _powerOn: false,
  _fanSpeed: 0,
  _flameSize: 0,
  _implementation: DummyImplementation,
  identify: function() {
    console.log("Identify the '%s'", this.name);
  },
  setPower: function(on) {
    if (on != this._powerOn) {
      // toggle state
      console.log("Power state changed To " + on);
      this._implementation.togglePower();
      this._powerOn = on;
    }
  },
};

// create the HAP-NodeJS Accessory
var UUID = uuid.generate('hap-nodejs:accessories:fireplace' + FireplaceController.name);
var fireplaceAccessory = exports.accessory = new Accessory('Fireplace', UUID);

// add properties for publishing
fireplaceAccessory.username = FireplaceController.username;
fireplaceAccessory.pincode = FireplaceController.pincode;

// set some basic properties (these values are arbitrary and setting them is optional)
fireplaceAccessory
  .getService(Service.AccessoryInformation)
  .setCharacteristic(Characteristic.Manufacturer, FireplaceController.manufacturer)
  .setCharacteristic(Characteristic.Model, FireplaceController.model)
  .setCharacteristic(Characteristic.SerialNumber, FireplaceController.serialNumber);

// listen for the "identify" event for this Accessory
fireplaceAccessory.on('identify', function(paired, callback) {
  FireplaceController.identify();
  callback(); // success
});

// add the power switch service
var SwitchService = fireplaceAccessory.addService(Service.Switch, "Fireplace");
SwitchService.getCharacteristic(Characteristic.On)
.on('set', function(value, callback) {
  FireplaceController.setPower(value);
  callback();
});

SwitchService.getCharacteristic(Characteristic.On)
.on('get', function(callback) {
  callback(null, FireplaceController._powerOn);
});

// var FanService = Fireplace.addService(Service.Fan, "Fireplace Fan") // services exposed to the user should have "names" like "Fake Light" for us
// FanService.getCharacteristic(Characteristic.On)
//   .on('set', function(value, callback) {
//     console.log("Fan Power Changed To "+value);
//     Fireplace_data.fanSpeed=value
//     callback(); // Our fake Fan is synchronous - this value has been successfully set
//   });

// FanService.getCharacteristic(Characteristic.On)
//   .on('get', function(callback) {

//     // this event is emitted when you ask Siri directly whether your fan is on or not. you might query
//     // the fan hardware itself to find this out, then call the callback. But if you take longer than a
//     // few seconds to respond, Siri will give up.

//     var err = null; // in case there were any problems

//     if (Fireplace_data.fanSpeed > 0) {
//       callback(err, true);
//     }
//     else {
//       callback(err, false);
//     }
//   });

// // also add an "optional" Characteristic for spped
// FanService.addCharacteristic(Characteristic.RotationSpeed)
//   .on('get', function(callback) {
//     callback(null, Fireplace_data.rSpeed);
//   })
//   .on('set', function(value, callback) {
//     console.log("Setting fan rSpeed to %s", value);
//     Fireplace_data.fanSpeed=value
//     callback();
//   })

fireplaceAccessory.setPrimaryService(SwitchService);
