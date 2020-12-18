let btnService = null;
let btnACharacteristic = null;
let btnBCharacteristic = null;

let accelService = null;
let accelCharacteristic = null;

let sinThetaX = 0;
let sinThetaY = 0;

// BUTTONS
const BTN_SERVICE = 'E95D9882-251D-470A-A062-FA1922DFA9A8'.toLowerCase();
const BTN_A_STATE = 'E95DDA90-251D-470A-A062-FA1922DFA9A8'.toLowerCase();
const BTN_B_STATE = 'E95DDA91-251D-470A-A062-FA1922DFA9A8'.toLowerCase();

// ACCELEROMETER
const ACCEL_SERVICE = 'E95D0753-251D-470A-A062-FA1922DFA9A8'.toLowerCase();
const ACCEL_DATA = 'E95DCA4B-251D-470A-A062-FA1922DFA9A8'.toLowerCase();
const ACCEL_PERIOD = 'E95DFB24-251D-470A-A062-FA1922DFA9A8'.toLowerCase();

const services = [BTN_SERVICE, ACCEL_SERVICE];

async function pair() {
    if (!navigator.bluetooth) {
        alert("Web Bluetooth is not supported in this browser.")
        return;
    }
    // requestDevice();
    try {
        console.log('requesting bluetooth device...');
        const uBitDevice = await navigator.bluetooth.requestDevice({
            filters: [{ namePrefix: "BBC micro:bit" }],
            optionalServices: services
        });

        console.log('connecting to GATT server...');
        const server = await uBitDevice.gatt.connect();

        console.log('getting service...');
        btnService = await server.getPrimaryService(BTN_SERVICE);
        accelService = await server.getPrimaryService(ACCEL_SERVICE);

        console.log('getting characteristics...');
        btnACharacteristic = await btnService.getCharacteristic(BTN_A_STATE);
        btnACharacteristic.startNotifications();
        btnACharacteristic.addEventListener('characteristicvaluechanged', btnAPressed);

        btnBCharacteristic = await btnService.getCharacteristic(BTN_B_STATE);
        btnBCharacteristic.startNotifications();
        btnBCharacteristic.addEventListener('characteristicvaluechanged', btnBPressed);

        accelCharacteristic = await accelService.getCharacteristic(ACCEL_DATA);
        accelCharacteristic.startNotifications();
        accelCharacteristic.addEventListener('characteristicvaluechanged', accelChanged);

        console.log('ready');


    } catch (error) {
        console.log(error);
    }
}

function btnAPressed(event) {
    const btnAState = event.target.value.getInt8();
    if (btnAState == 1) {
        if(me.x > 0){
            me.x = me.x-5;
        }

    }
}

function btnBPressed(event) {
    const btnBState = event.target.value.getInt8();
    if (btnBState == 1) {
        if(me.x < canvasSize){
            me.x = me.x+5;
        }
    }
}

function accelChanged(event){
    // Retrieve acceleration values,
    // then convert from milli-g (i.e. 1/1000 of a g) to g
    // console.log(event.target.value);
    const accelX = event.target.value.getInt16(0, true) / 1000.0;
    const accelY = event.target.value.getInt16(2, true) / 1000.0;
    const accelZ = event.target.value.getInt16(4, true) / 1000.0;
  
    // console.log('x: ', accelX, ' y: ', accelY, ' z: ', accelZ);
    
    if(me.x <= canvasSize && me.x >= 0){
        me.x += accelX*5;
    }else if(me.x < 0){
        me.x = 0;
    }else if(me.x > canvasSize){
        me.x = canvasSize;
    }

    if(me.y <= canvasSize && me.y >= 0){
        me.y += accelY*5;
    }else if(me.y < 0){
        me.y = 0;
    }else if(me.y > canvasSize){
        me.y = canvasSize;
    }

    sinThetaX = constrain(accelX, -1, 1); // maybe used to change direction later
    sinThetaY = constrain(accelY, -1, 1); // use to change direction later
  }
