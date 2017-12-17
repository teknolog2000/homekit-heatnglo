var Accessory = require('../').Accessory;
var Service = require('../').Service;
var Characteristic = require('../').Characteristic;
var uuid = require('../').uuid;
var rpio = require('rpio');

var DummyImplementation = {
  init: function() {
    console.log("DummyImplementation init");
  },
  togglePower: function() {
    console.log("DummyImplementation togglePower");
  },
  toggleFan: function() {
    console.log("DummyImplementation toggleFan");
  },
  toggleFlame: function() {
    console.log("DummyImplementation toggleFlame");
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
    console.log("HardwareImplementation init");    
    rpio.open(this.Pins.PIN_ONOFF, rpio.OUTPUT, rpio.LOW);
    rpio.open(this.Pins.PIN_FAN, rpio.OUTPUT, rpio.LOW);
    rpio.open(this.Pins.PIN_FLAME, rpio.OUTPUT, rpio.LOW);
    rpio.open(this.Pins.PIN_PILOT, rpio.OUTPUT, rpio.LOW);
  },
  togglePower: function() {
    console.log("HardwareImplementation togglePower");
    this._blipPin(this.Pins.PIN_ONOFF);
  },
  toggleFan: function() {
    console.log("HardwareImplementation toggleFan");
    this._blipPin(this.Pins.PIN_FAN);
  },
  toggleFlame: function() {
    console.log("HardwareImplementation toggleFlame");
    this._blipPin(this.Pins.PIN_FLAME);
  },
  _blipPin: function(pin) {
    rpio.sleep(0.5);
    console.log("setting pin " + pin + " high");
    rpio.write(pin, rpio.HIGH);
    rpio.sleep(0.5);
    console.log("setting pin " + pin + " low");
    rpio.write(pin, rpio.LOW);
  }
};

var FireplaceController = {
  name: "Fireplace",
  username: "1B:2B:3C:4D:5E:FF",
  pincode: "031-45-154",
  manufacturer: "Heat & Glo",
  model: "1.0",
  serialNumber: "0",
  MAX_FLAME: 4,
  MAX_FAN: 4,
  _powerOn: false,
  _fanSpeed: 0,
  _flameSize: 0,
  _implementation: HardwareImplementation, //_implementation: DummyImplementation,
  init: function() {
    this._implementation.init();
  },
  identify: function() {
    console.log("Identify the '%s'", this.name);
  },
  setPower: function(on) {
    console.log("setPower");

    if (on == this._powerOn) {
      return;
    }

    this._implementation.togglePower();
    this._powerOn = on;
  },
  getPower: function() {
    return this._powerOn;
  },
  setFan: function(speed) {
    console.log("setFan");
    
    if (speed == this._fanSpeed) {
      return;
    }

    var toggles = speed - this._fanSpeed;
    if (toggles < 0) {
      toggles += this.MAX_FAN;
    }

    for (var i=0; i<toggles;i++) {
      this._implementation.toggleFan();
    }
    
    this._fanSpeed = speed;
  },
  getFan: function() {
    console.log("getFan");
    
    if (!this._powerOn) {
      return 0;
    }

    return this._fanSpeed;
  },
  setFlame: function(size) {
    console.log("setFlame");

    if (size == this._flameSize) {
      return;
    }

    // ensure power is the right 
    this.setPower(size > 0);

    if (size > 0) {
      // JS doesn't have a proper modulo operator
      var toggles = size - this._flameSize;
      if (toggles < 0) {
        toggles += this.MAX_FLAME;
      }

      for (var i=0; i<toggles;i++) {
        this._implementation.toggleFlame();
      }
    }
    this._flameSize = size;
  },
  getFlame: function() {
    console.log("getFlame");    
    if (!this._powerOn) {
      return 0;
    }

    return this._flameSize;
  },
};

// create the HAP-NodeJS Accessory
var UUID = uuid.generate('hap-nodejs:accessories:fireplace' + FireplaceController.name);
var fireplaceAccessory = exports.accessory = new Accessory('Fireplace', UUID);

FireplaceController.init();

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

var switchService = fireplaceAccessory.addService(Service.Switch, "Fireplace");
switchService.getCharacteristic(Characteristic.On)
  .on('set', function(value, callback) {
    FireplaceController.setPower(value);
    callback();
  })
  .on('get', function(callback) {
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
