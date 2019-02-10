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

  try {
    // Construct a new device and resolve the IP
    this.tuyaDevice = new TuyaDevice({id: config["id"],
                                      key: config["key"],
                                      persistentConnection: true});

    this.tuyaDevice.resolveId()
      .then(() => this.tuyaDevice.connect())
      .then(connected => {
        this.log('Connected: %s', connected);
        return this.tuyaDevice.get({schema: true});
      })
      .then(schema => this.log('Schema for this device:\n%s', JSON.stringify(schema, null, 2)));

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
}

FanAccessory.prototype.getActive = function(callback) {
  this.log("Getting current active state...");

  if (this.tuyaDevice.isConnected()) {
    this.tuyaDevice.get()
      .then(status => {
        this.log("Returned current active state as " + status);
        callback(null, status ? Characteristic.Active.ACTIVE : Characteristic.Active.INACTIVE);
      })
      .catch((err) => callback(err));
  } else {
    callback('error');
  }
}

FanAccessory.prototype.setActive = function(state, callback) {
  if (this.service.getCharacteristic(Characteristic.Active).value == state) {
    callback(null);
    return;
  }

  this.log("Set active to %s", state);

  if (this.tuyaDevice.isConnected()) {
    this.tuyaDevice.set({set: state == Characteristic.Active.ACTIVE ? true : false})
      .then(success => {
        this.log("Set Active " + success ? "succeeded" : "failed");
        callback(success ? null : 'error');
      })
      .catch((err) => callback(err));
  } else {
    callback('error');
  }
}

FanAccessory.prototype.getRotationSpeed = function(callback) {
  this.log("Getting current rotation speed...");

  if (this.tuyaDevice.isConnected()) {
    this.tuyaDevice.get({dps: 2})
      .then(speed => {
        var percentage = speed/12*100;
        this.log("Returned rotation speed of " + percentage);
        callback(null, percentage);
      })
      .catch((err) => callback(err));
  } else {
    callback('error');
  }
}

FanAccessory.prototype.setRotationSpeed = function(speed, callback) {
  this.log("Set rotation speed to %s", speed);

  var speedIncrement = Math.ceil(speed*0.12)
  if (this.tuyaDevice.isConnected()) {
    this.tuyaDevice.get({schema: true})
      .then(schema => {
        var data = schema.dps;
        data['1'] = true;
        data['2'] = speedIncrement;
        data['3'] = 'normal';
        return this.tuyaDevice.set({multiple: true, data: data});
      })
      .then(success => {
        this.log("Set rotation speed " + success ? "succeeded" : "failed");
        callback(success ? null : 'error');
      })
      .catch((err) => callback(err));
  } else {
    callback('error');
  }
}

FanAccessory.prototype.getSwingMode = function(callback) {
  this.log("Getting current SwingMode...");
  
  if (this.tuyaDevice.isConnected()) {
    this.tuyaDevice.get({dps: 8})
      .then(state => {
        var swingMode = state ? Characteristic.SwingMode.SWING_ENABLED : Characteristic.SwingMode.SWING_DISABLED;
        this.log("Returned SwingMode of " + swingMode);
        callback(null, swingMode);
      })
      .catch((err) => callback(err));
  } else {
    callback('error');
  }
}

FanAccessory.prototype.setSwingMode = function(state, callback) {
  this.log("Set SwingMode to %s", state);
  
  if (this.tuyaDevice.isConnected()) {
    this.tuyaDevice.set({dps: 8, set: state == Characteristic.SwingMode.SWING_ENABLED ? true : false })
      .then(success => {
        this.log("Set SwingMode " + success ? "succeeded" : "failed");
        callback(success ? null : 'error');
      })
      .catch((err) => callback(err));
  } else {
    callback('error');
  }
}

FanAccessory.prototype.getServices = function() {
  return [this.service];
}
