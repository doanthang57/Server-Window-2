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

var seri = "0"
var i = 0;
var sys = {
  "sync": {
    "update":1,
    "room": null,
    "device":null,
    "deviceid":null
  }
}
var buffer = null;
var iot = {
    "update_iot":null
  }
//**************lang nghe thingShadow********************
thingShadows.register('Thang-Test', {}, function () {
  var receive_iot = {"state":{"desired":{"Data": iot}}}
  iot_data = thingShadows.update('Thang-Test', receive_iot);
  if (iot_data === null)
  {
    console.log('Update iot error');
  }
  else {
    console.log('Update iot successfull');
  }
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
           seri  = stateObject.state.Data.sync.seri;

           serialPort.write('@S')
           serialPort.write(seri)
           serialPort.write('x')
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
              if (stateObject.state.Data.container[i].action == 'smarthome.device.switch.on'||stateObject.state.Data.container[i].action == 'smarthome.lights.switch.on') {
                serialPort.write('X')
              }
              if (stateObject.state.Data.container[i].action == 'smarthome.device.switch.off'||stateObject.state.Data.container[i].action == 'smarthome.lights.switch.off' ) {
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
    var n = 5;
    for (var i = 0; i < n; i++) {
      switch (String.fromCharCode(data[i])) {
        case '@':
          if(i == 0)
          break;

        case 'F':

          if (i == 1) {

            i++;
            if(String.fromCharCode(data[2]) == '1'){
              buffer.container[0].id=String.fromCharCode(data[i]);
              buffer.container[0].device = 'fan';
            }
            if(String.fromCharCode(data[2]) == '2'){
              buffer.container[1].id=String.fromCharCode(data[i]);
              buffer.container[1].device = 'fan';
            }
            if(String.fromCharCode(data[2]) == '3'){
              buffer.container[2].id=String.fromCharCode(data[i]);
              buffer.container[2].device = 'fan';
            }
            break;
          }

        case 'L':

          if (i == 1) {

            i++;
            if(String.fromCharCode(data[2]) == '1'){
              buffer.container[0].id=String.fromCharCode(data[i]);
              buffer.container[0].device = 'light';
            }
            if(String.fromCharCode(data[2]) == '2'){
              buffer.container[1].id=String.fromCharCode(data[i]);
              buffer.container[1].device = 'light';
            }
            if(String.fromCharCode(data[2]) == '3'){
              buffer.container[2].id=String.fromCharCode(data[i]);
              buffer.container[2].device = 'light';
            }
            break;
          }
        case 'V':

          if (i == 1) {
            buffer.container[0].device = 'tv';
            i++;
            if(String.fromCharCode(data[2]) == '1'){
              buffer.container[0].id=String.fromCharCode(data[i]);
              buffer.container[0].device = 'tv';
            }
            if(String.fromCharCode(data[2]) == '2'){
              buffer.container[1].id=String.fromCharCode(data[i]);
              buffer.container[1].device = 'tv';
            }
            if(String.fromCharCode(data[2]) == '3'){
              buffer.container[2].id=String.fromCharCode(data[i]);
              buffer.container[2].device = 'tv';
            }
            break;
          }

        case 'B':
          if(i ==3){
              buffer.container[0].room = 'bedroom';
              break;
          }
        case 'K':
          if(i ==3){
              buffer.container[0].room = 'kitchen';
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
