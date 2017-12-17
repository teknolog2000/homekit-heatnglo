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
  },
  toggleFan: function() {
    console.log("toggleFan");
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
  setFan: function(speed) {
    if (speed != this._fanSpeed) {
      var MAX_SPEED = 4;

      // JS doesn't have a proper modulo operator
      var toggles = speed - this._fanSpeed;
      if (toggles < 0) {
        toggles += MAX_SPEED;
      }

      for (var i=0; i<toggles;i++) {
        this._implementation.toggleFan();
      }
    }
    this._fanSpeed = speed;
  }
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
var switchService = fireplaceAccessory.addService(Service.Switch, "Fireplace");
switchService.getCharacteristic(Characteristic.On)
.on('set', function(value, callback) {
  FireplaceController.setPower(value);
  callback();
});

switchService.getCharacteristic(Characteristic.On)
.on('get', function(callback) {
  callback(null, FireplaceController._powerOn);
});

var fanService = fireplaceAccessory.addService(Service.Fan, "Fireplace Fan") // services exposed to the user should have "names" like "Fake Light" for us
fanService.getCharacteristic(Characteristic.On)
  .on('set', function(value, callback) {
    FireplaceController.setFan(value);
    callback();
  })
  .on('get', function(callback) {
      callback(null, FireplaceController._fanSpeed);
  });

// also add an "optional" Characteristic for spped
fanService.addCharacteristic(Characteristic.RotationSpeed)
  .setProps({
    minValue: 0,
    maxValue: 4,
    minStep: 1
  })
  .on('get', function(callback) {
    callback(null, 0);
  })
  .on('set', function(value, callback) {
    callback();
  })

fireplaceAccessory.setPrimaryService(switchService);
