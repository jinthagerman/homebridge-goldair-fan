const TuyaDevice = require('tuyapi');

var Service, Characteristic;

module.exports = function(homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;

  homebridge.registerAccessory("homebridge-goldair-fan", "GoldairSleepSmart", FanAccessory);
}

function FanAccessory(log, config) {
  this.log = log;
  this.name = config["name"];

  this.service = new Service.Fanv2(this.name);

  //this.addCharacteristic(Characteristic.Active);
  //this.addOptionalCharacteristic(Characteristic.CurrentFanState);
  //this.addOptionalCharacteristic(Characteristic.TargetFanState);
  //this.addOptionalCharacteristic(Characteristic.LockPhysicalControls);
  //this.addOptionalCharacteristic(Characteristic.Name);
  //this.addOptionalCharacteristic(Characteristic.RotationDirection);
  //this.addOptionalCharacteristic(Characteristic.RotationSpeed);
  //this.addOptionalCharacteristic(Characteristic.SwingMode);

  try {
    // Construct a new device and resolve the IP
    this.tuyaDevice = new TuyaDevice({id: config["id"], key: config["key"], persistentConnection: true});

    this.tuyaDevice.resolveId()
      .then(() => this.tuyaDevice.connect())
      .then(connected => this.log.info('Connected: %s', connected))

  } catch (error) {
    this.log.error(
      '%s was unable to be found. Please try using a static IP in your config.json.',
      device.id
    );
  }

  this.service
    .getCharacteristic(Characteristic.Active)
    .on('get', this.getActive.bind(this))
    .on('set', this.setActive.bind(this));

  this.service
    .getCharacteristic(Characteristic.RotationSpeed)
    .on('get', this.getRotationSpeed.bind(this))
    .on('set', this.setRotationSpeed.bind(this));

  this.service
    .getCharacteristic(Characteristic.SwingMode)
    .on('get', this.getSwingMode.bind(this))
    .on('set', this.setSwingMode.bind(this));

  this.service
    .getCharacteristic(Characteristic.LockPhysicalControls)
    .on('get', this.getLockPhysicalControls.bind(this))
    .on('set', this.setLockPhysicalControls.bind(this));
}

FanAccessory.prototype.getActive = function(callback) {
  this.log("Getting current active state...");

  if (this.tuyaDevice.isConnected()) {
    this.tuyaDevice.get()
      .then(status => callback(null, status ? Characteristic.Active.ACTIVE : Characteristic.Active.INACTIVE) )
  } else {
    callback('error')
  }
}

FanAccessory.prototype.setActive = function(state, callback) {
  this.log("Set active to %s", state);

  if (this.tuyaDevice.isConnected()) {
    this.tuyaDevice.set({set: state == Characteristic.Active.ACTIVE ? true : false})
      .then(success => callback(success ? null : 'error'))
  } else {
    callback('error')
  }
}

FanAccessory.prototype.getRotationSpeed = function(callback) {
  this.log("Getting current rotation speed...");
  callback(null, 100);
}

FanAccessory.prototype.setRotationSpeed = function(state, callback) {
  this.log("Set rotation speed to %s", state);
}

FanAccessory.prototype.getSwingMode = function(callback) {
  this.log("Getting current SwingMode...");
  callback(null, Characteristic.SwingMode.SWING_ENABLED);
}

FanAccessory.prototype.setSwingMode = function(state, callback) {
  this.log("Set SwingMode to %s", state);
}

FanAccessory.prototype.getLockPhysicalControls = function(callback) {
  this.log("Getting current LockPhysicalControls state...");
  callback(null, Characteristic.LockPhysicalControls.CONTROL_LOCK_ENABLED);
}

FanAccessory.prototype.setLockPhysicalControls = function(state, callback) {
  this.log("Set LockPhysicalControls to %s", state);
}

FanAccessory.prototype.getServices = function() {
  return [this.service];
}
