var awsIot = require('aws-iot-device-sdk');
var SerialPort = require("serialport");
var serialPort = new SerialPort("COM14", { baudRate: 115200 });


var clientTokenUpdate;
var sessionidnumber;
var local_sessionid = "0";//tam thoi

var thingShadows = awsIot.thingShadow({
   keyPath: './certs/ef21fe66d7-private.pem.key',
  certPath: './certs/ef21fe66d7-certificate.pem.crt',
    caPath: './certs/root-CA.crt',
  clientId: 'nameThang',
      host: 'aupu5tnzgckec.iot.ap-southeast-1.amazonaws.com'

});

var seri = "0 "
var i = 0;
var sys = {
  "sync": {
    "update":null,
    "room": null,
    "device":null,
    "deviceid":null
  }
}
var buffer = null;
//        {
//       "container": [{
//         "action": "turnon",
//         "deviceid": "light",
//         "device":"1",
//         "id": "01",
//         "room": "livingroom",
//         "mode": "set",
//         "sessionid": "01",
//         "lux": "100",
//         "all": 1
//     },
//       {
//         "action": "turn on",
//         "device": "light",
//         "device":"1",
//         "id": "01",
//         "room": "living room",
//         "mode": "set",
//         "sessionid": "01",
//         "lux": "100",
//         "all": 1
//       },
//       {
//         "action": "turn on",
//         "device": "light",
//         "device":"1",
//         "id": "01",
//         "room": "living room",
//         "mode": "set",
//         "sessionid": "01",
//         "lux": "100",
//         "all": 1
//       }
//     ],
//     "sync":
//     {
//       "update" = 1
//     }
// }
//**************lang nghe thingShadow********************
thingShadows.register('Thang-Test', {}, function () {
});

thingShadows.on('delta',
      function(thingName, stateObject) {
          buffer = stateObject.state.Data;
          console.log("IoT buffer: " + JSON.stringify(buffer));
      });

thingShadows.on('delta',
    function(thingName, stateObject) {
       // console.log('SSID: '+ JSON.stringify(stateObject.state.Data.container[0].sessionid)); // dang string
       // console.log('SSID2: '+ stateObject.state.Data.container[0].sessionid); // dang json
       // sessionid = stateObject.state.Data.container[0].sessionid;
       // sessionidnumber = Number(sessionid);
       // sessionidnumber = sessionidnumber + 1;
       // buffer.container[0].sessionid = sessionidnumber;

       var data1,data2,data3;
       if (stateObject.state.Data.sync.update != 1 ){
           data1 = stateObject.state.Data.sync.room;
           data2 = stateObject.state.Data.sync.device;
           data3 = stateObject.state.Data.sync.iddevice;

           serialPort.write('@')
           if (data1 == 'bedroom') {
             serialPort.write('B')
           }
           if (data1 == 'kitchen') {
             serialPort.write('K')
           }
           if (data1 == 'livingroom') {
             serialPort.write('R')
           }
           if (data2 == 'light') {
             serialPort.write('L')
             serialPort.write(data3)
           }
           if (data2 == 'fan') {
             serialPort.write('F')
             serialPort.write(data3)
           }
           if (data2 == 'tv') {
             serialPort.write('V')
             serialPort.write(data3)
           }
         var updatedevice = {"state":{"desired":{"Data": sys}}}
             clientTokenUpdate = thingShadows.update('Thang-Test', updatedevice);
           }
       else {

            // convent
            serialPort.write('@')
            for(var i = 0; stateObject.state.Data.container[i] != null ; i++){

            if (stateObject.state.Data.container[i].device == 'light') {
              serialPort.write('L')
              serialPort.write(stateObject.state.Data.container[i].id)
            }
            if (stateObject.state.Data.container[i].device == 'fan') {
              serialPort.write('F')
              serialPort.write(stateObject.state.Data.container[i].id)
            }
            if (stateObject.state.Data.container[i].device == 'tv') {
              serialPort.write('V')
              serialPort.write(stateObject.state.Data.container[i].id)
            }
            if (stateObject.state.Data.container[i].room == 'bedroom') {
              serialPort.write('B')
            }
            if (stateObject.state.Data.container[i].room == 'kitchen') {
              serialPort.write('K')
            }
            if (stateObject.state.Data.container[i].room == 'livingroom') {
              serialPort.write('R')
            }
            if (stateObject.state.Data.container[i].action == 'smarthome.device.switch.on') {
              serialPort.write('X')
            }
            if (stateObject.state.Data.container[i].action == 'smarthome.device.switch.off') {
              serialPort.write('Y')
            }
            // if (stateObject.state.Data.container[i].mode == 'auto') {
            //   serialPort.write('A')
            // }
            // if (stateObject.state.Data.container[i].mode == 'set') {
            //   serialPort.write('S')
            // }

          }
            serialPort.write('x')
            console.log('OK');
        }

});

// Nhan serial PORT tu device
  serialPort.on('open',onOpen);
  serialPort.on('data',onData);

  function onOpen(){
    console.log("Open connected serialport");
  }

 function onData(data){
    //data = String(data);
    console.log('Data receive: '+data); // show buff nhan duoc
    //-----------------@L1OLS100----------------------------
    var n = 10;
    for (var i = 0; i < n; i++) {
      switch (String.fromCharCode(data[i])) {
        case '@':
          if(i == 0)
          break;

        case 'F':

          if (i == 1) {
            i++;
            buffer.container[0].device = 'fan';
            buffer.container[0].id=String.fromCharCode(data[i]);
            break;
          }

        case 'L':

          if (i == 1) {
            i++;
            buffer.container[0].device = 'light';
            buffer.container[0].id=String.fromCharCode(data[i]);
            break;
          }
        case 'V':

          if (i == 1) {
            i++;
            buffer.container[0].device = 'tv';
            buffer.container[0].id=String.fromCharCode(data[i]);
            break;
          }

        case 'B':
          if(i ==3){
              buffer.container[0].room = 'bedroom';
              break;
          }
        case 'K':
          if(i ==3){
              buffer.container[0].room = 'kitchenroom';
              break;
          }
        case 'R':
          if(i ==3){
              buffer.container[0].room = 'livingroom';
              break;
              }

        case 'X':
          if(i ==4){
              buffer.container[0].action = "smarthome.device.switch.on";
              break;
          }
        case 'Y':
          if(i ==4){
              buffer.container[0].action = "smarthome.device.switch.off";
              break;
          }
        // case 'S':
        //   if(i ==5){
        //       buffer.container[0].mode = 'set';
        //       for( i = 6; i< 9; i++)
        //       {
        //         buffer.container[0].lux=String.fromCharCode(data[6])+String.fromCharCode(data[7])+String.fromCharCode(data[8]);
        //       }
        //       break;
        //   }
        // case 'A':
        //   if(i ==5){
        //       buffer.container[0].mode = 'auto';
        //       for( i = 6; i< 9; i++)
        //       {
        //         buffer.container[0].lux=String.fromCharCode(data[6])+String.fromCharCode(data[7])+String.fromCharCode(data[8]);
        //       }
        //
        //       break;
        //   }

        default:
          i = n - 1;
          console.log('SAI HET ROI, NHAP LAI CHUOI');
          break;
    }
  }

  var updateshadow = {"state":{"desired":{"Data": buffer}}}
    clientToken = thingShadows.update('Thang-Test', updateshadow);

      if (clientToken === null)
      {
        console.log('Update error');
      }
      else {
        console.log('Update successfull: '+clientToken);
      }
  console.log(buffer);
  }
