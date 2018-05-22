var awsIot = require('aws-iot-device-sdk');
var SerialPort = require("serialport");
var serialPort = new SerialPort("COM1", { baudRate: 115200 });


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
var buffer = {
    "container": [{
      "action": "turn on",
      "device": "light",
      "id": "01",
      "room": "living room",
      "mode": "set",
      "sessionid": "01",
      "lux": "100"
    },
      {

      }
    ],

    "update":{
      "seri":"0",
      "action": "turn off",
      "device": "Fan",
      "id": "01",
      "room": "Beb room",
      "mode": "set",
      "lux": "100"
    }
  }
// lang nghe thingShadow

thingShadows.on('delta',
    function(thingName, stateObject) {
       console.log('SSID: '+ JSON.stringify(stateObject.state.Data.container[0].sessionid)); // dang string
       console.log('SSID2: '+ stateObject.state.Data.container[0].sessionid); // dang json
       sessionid = stateObject.state.Data.container[0].sessionid;
       sessionidnumber = Number(sessionid);
       sessionidnumber = sessionidnumber + 1;
       buffer.container[0].sessionid = sessionidnumber;

       if(sessionid === null)
         {
           console.log("Error: SSID rong~");
         }
       var data1,data2,data3;
       if (stateObject.state.Data.sync.update != null ){
           data1 = stateObject.state.Data.sync.room;
           data2 = stateObject.state.Data.sync.device;
           data3 = stateObject.state.Data.sync.deviceid;

           serialPort.write('@')
           if (data1 == 'Bed Room') {
             serialPort.write('B')
           }
           if (data1 == 'Kitchen') {
             serialPort.write('K')
           }
           if (data1 == 'Living Room') {
             serialPort.write('R')
           }
           if (data2 == 'Light') {
             serialPort.write('L')
             serialPort.write(data3)
           }
           if (data2 == 'Fan') {
             serialPort.write('F')
             serialPort.write(data3)
           }
           if (data2 == 'TV') {
             serialPort.write('V')
             serialPort.write(data3)
           }
         var updatedevice = {"state":{"desired":{"Data": sys}}}
             clientTokenUpdate = thingShadows.update('Thang-Test', updatedevice);
           }
       else {
          if(sessionid != local_sessionid) //Neu SSID Thay doi
          {
            // convent
            serialPort.write('@')

            if (stateObject.state.Data.container[0].device == 'Light') {
              serialPort.write('L')
              serialPort.write(stateObject.state.Data.container[0].id)
            }
            if (stateObject.state.Data.container[0].device == 'Fan') {
              serialPort.write('F')
              serialPort.write(stateObject.state.Data.container[0].id)
            }
            if (stateObject.state.Data.container[0].device == 'TV') {
              serialPort.write('V')
              serialPort.write(stateObject.state.Data.container[0].id)
            }
            if (stateObject.state.Data.container[0].room == 'Bed Room') {
              serialPort.write('B')
            }
            if (stateObject.state.Data.container[0].room == 'Kitchen') {
              serialPort.write('K')
            }
            if (stateObject.state.Data.container[0].room == 'Living Room') {
              serialPort.write('R')
            }
            if (stateObject.state.Data.container[0].action == 'Turn On') {
              serialPort.write('X')
            }
            if (stateObject.state.Data.container[0].action == 'Turn Off') {
              serialPort.write('Y')
            }
            if (stateObject.state.Data.container[0].mode == 'Auto') {
              serialPort.write('A')
            }
            if (stateObject.state.Data.container[0].mode == 'SET') {
              serialPort.write('S')
            }
              serialPort.write('x')

            //updat firmware
            console.log('OK');
          }
          else {
            console.log('Error 2: SSID trung`');
          }
       }
       // console.log('received delta on '+thingName+': '+
       //             JSON.stringify(stateObject));
    });


// /***********Set ID device**************/
// thingShadows.on('delta',
//       function(thingName, stateObject) {
//
// var data1,data2,data3;
//
//   if (stateObject.state.Data.sync.update != null ){
//       data1 = stateObject.state.Data.sync.room;
//       data2 = stateObject.state.Data.sync.device;
//       data3 = stateObject.state.Data.sync.deviceid;
//
//       serialPort.write('@')
//       if (data1 == 'Bed Room') {
//         serialPort.write('B')
//       }
//       if (data1 == 'Kitchen') {
//         serialPort.write('K')
//       }
//       if (data1 == 'Living Room') {
//         serialPort.write('R')
//       }
//       if (data2 == 'Light') {
//         serialPort.write('L')
//         serialPort.write(data3)
//       }
//       if (data2 == 'Fan') {
//         serialPort.write('F')
//         serialPort.write(data3)
//       }
//       if (data2 == 'TV') {
//         serialPort.write('V')
//         serialPort.write(data3)
//       }
//   var updatedevice = {"state":{"desired":{"Data": sys}}}
//     clientTokenUpdate = thingShadows.update('Thang-Test', updatedevice);
//
//
//       }
//   });
// Nhan serial PORT tu device
  serialPort.on('open',onOpen);
  serialPort.on('data',onData);

  function onOpen(){
    console.log("Open connected serialport");
  }


  thingShadows.register('Thang-Test', {}, function () {
  })

  function onData(data){
    //data = String(data);
    console.log('Data receive: '+data); // show buff nhan duoc
    //-----------------@L1OLS100----------------------------
    var n = 8;
    for (var i = 0; i < n; i++) {
      switch (String.fromCharCode(data[i])) {
        case '@':
          if(i == 0)
          break;

        case 'F':

          if (i == 1) {
            i++;
            buffer.container[0].device = 'Fan';
            buffer.container[0].id=String.fromCharCode(data[i]);
            break;
          }

        case 'L':

          if (i == 1) {
            i++;
            buffer.container[0].device = 'Light';
            buffer.container[0].id=String.fromCharCode(data[i]);
            break;
          }
        case 'V':

          if (i == 1) {
            i++;
            buffer.container[0].device = 'TV';
            buffer.container[0].id=String.fromCharCode(data[i]);
            break;
          }

        case 'B':
          if(i ==3){
              buffer.container[0].room = 'Bed Room';
              break;
          }
        case 'K':
          if(i ==3){
              buffer.container[0].room = 'Kitchen Room';
              break;
          }
        case 'R':
          if(i ==3){
              buffer.container[0].room = 'Living Room';
              break;
              }

        case 'X':
          if(i ==4){
              buffer.container[0].action = 'Turn On'; // 1 la bat
              break;
          }
        case 'Y':
          if(i ==4){
              buffer.container[0].action = 'Turn Off'; // 0 la tat
              break;
          }
        case 'S':
          if(i ==5){
              buffer.container[0].mode = 'SET';
              for( i = 6; i< 9; i++)
              {
                buffer.container[0].lux=String.fromCharCode(data[6])+String.fromCharCode(data[7])+String.fromCharCode(data[8]);
              }
              break;
          }
        case 'A':
          if(i ==5){
              buffer.container[0].mode = 'Auto';
              for( i = 6; i< 9; i++)
              {
                buffer.container[0].lux=String.fromCharCode(data[6])+String.fromCharCode(data[7])+String.fromCharCode(data[8]);
              }

              break;
          }

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
