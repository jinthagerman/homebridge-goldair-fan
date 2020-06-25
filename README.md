# homebridge-goldair-fan

1. Obtain the tuya device id and key for each fan you want to control. I used the instructions on from @nikrolls `homeassistant-goldair-climate` but there's lots of ways to do it.
https://github.com/nikrolls/homeassistant-goldair-climate#finding-your-device-id-and-local-key 
2. Add an accessory to your homebridge config `accessories` for each fan you want to control with the following format.
```
   {
      "accessory": "GoldairSleepSmart",
      "name": "<device name>",
      "id": "<id>",
      "key": "<key>",
      "has_light_control": <true | false>
    }
```
