var Service, Characteristic;

module.exports = function(homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;

  homebridge.registerAccessory("homebridge-goldair-fan", "GoldairSleepSmart", FanAccessory);
}

function FanAccessory(log, config) {
  this.log = log;
  this.name = config["name"];
  this.accessToken = config["id"];
  this.lockID = config["key"];
  
  this.service = new Service.Fanv2(this.name);

  //this.addCharacteristic(Characteristic.Active);
  //this.addOptionalCharacteristic(Characteristic.CurrentFanState);
  //this.addOptionalCharacteristic(Characteristic.TargetFanState);
  //this.addOptionalCharacteristic(Characteristic.LockPhysicalControls);
  //this.addOptionalCharacteristic(Characteristic.Name);
  //this.addOptionalCharacteristic(Characteristic.RotationDirection);
  //this.addOptionalCharacteristic(Characteristic.RotationSpeed);
  //this.addOptionalCharacteristic(Characteristic.SwingMode);

  this.service
    .getCharacteristic(Characteristic.Active)
    .on('get', this.getState.bind(this))
    .on('set', this.setState.bind(this));

  this.service
    .getCharacteristic(Characteristic.RotationSpeed)
    .on('get', this.getState.bind(this))
    .on('set', this.setState.bind(this));

  this.service
    .getCharacteristic(Characteristic.SwingMode)
    .on('get', this.getState.bind(this))
    .on('set', this.setState.bind(this));

  this.service
    .getCharacteristic(Characteristic.LockPhysicalControls)
    .on('get', this.getState.bind(this))
    .on('set', this.setState.bind(this));
}

LockitronAccessory.prototype.getState = function(callback) {
  this.log("Getting current state...");
  this.service.setCharacteristic(Characteristic.Active, Characteristic.Active.ACTIVE);
  this.service.setCharacteristic(Characteristic.RotationSpeed, 100);
  this.service.setCharacteristic(Characteristic.SwingMode, Characteristic.SwingMode.SWING_ENABLED);
  this.service.setCharacteristic(Characteristic.LockPhysicalControls, Characteristic.LockPhysicalControls.CONTROL_LOCK_ENABLED);
}

LockitronAccessory.prototype.setState = function(state, callback) {
  this.log("Set state to %s", lockitronState);
}

LockitronAccessory.prototype.getServices = function() {
  return [this.service];
}
