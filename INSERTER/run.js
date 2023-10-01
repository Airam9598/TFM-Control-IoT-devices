const path = require('path');
const fs = require('fs').promises;
const database = require('./database.js');
const { randomInt } = require('crypto');
const https = require('https');

function getCountry(lat, lng) {
  return new Promise((resolve, reject) => {
    const options = {
      host: "nominatim.openstreetmap.org",
      port: 443,
      path: '/reverse.php?lat=' + lat + '&lon=' + lng + '&zoom=18&format=jsonv2',
      method: 'GET',
      headers: {
        'User-Agent': 'MiAplicacion/1.0', // Reemplaza con el nombre y versión de tu aplicación
      }
    };
    setTimeout(()=>{
      const req = https.request(options, (res) => {
        let data = '';
        res.setEncoding('utf8');
  
        res.on('data', (chunk) => {
          data += chunk;
        });
  
        res.on('end', () => {
          try {
            const parsedData = JSON.parse(data);
            resolve(parsedData.address.country);
          } catch (error) {
            reject(error);
          }
        });
      });
  
      req.on('error', (error) => {
        reject(error);
      });
  
      req.end();

    },1000)
  });
}

async function processPanels() {
  const directoryPath = path.join(__dirname, 'ISMN_archive_20230607');
  try {
    const panels = await fs.readdir(directoryPath);

    for (const panel of panels) {
      const panelPath = path.join(directoryPath, panel);
      let actpanel=await database.setPanel(panel)
      if ((await fs.lstat(panelPath)).isDirectory()) {
        const zones = await fs.readdir(panelPath);

        for (const zone of zones) {
          const zonePath = path.join(panelPath, zone);
          if ((await fs.lstat(zonePath)).isDirectory()) {
            const devices = await fs.readdir(zonePath);

            var zoneCreated = false;
            var actZone;
            var i=0
            for (let device of devices) {
              i=i+1
              var data2
              if (device.includes("_ts_")) {
                try {
                  let data = await fs.readFile(path.join(zonePath, device), 'utf8');
                  let lines = data.split('\n');
                  for (let line of lines) {
                    let info = line.split(' ').filter(function (el) {return el != '';});
                    if (info.length > 5 ) { 
                      if(!zoneCreated){
                         actZone= await database.setZone(zone, await getCountry(info[3],info[4]),info[3],info[4],actpanel);
                         console.log(actZone)
                        zoneCreated = true;
                      }
                      data2=await database.setDevice(info[2]+"_ts",info[0]+info[2]+info[8]+"ts"+i+randomInt(10000),actZone,"ts")
                      
                    }else if( info.length <= 5){
                      
                      if(data2!= undefined && info[2]!=null && info[0] != null){
                        console.log("InserData")
                        await database.updateDevice(data2,"ts",info[2],info[0]+"T"+info[1])
                      }
                    }
                  }
                } catch (err) {
                  console.error('Error reading file:', err);
                }
              } else if (device.includes("_ta_")) {
                try {
                  let data = await fs.readFile(path.join(zonePath, device), 'utf8');
                  let lines = data.split('\n');
                  for (let line of lines) {
                    let info = line.split(' ').filter(function (el) {return el != '';});
                    if (info.length > 5) {
                      if(!zoneCreated ){
                        actZone= await database.setZone(zone, await getCountry(info[3],info[4]),info[3],info[4],actpanel);
                        console.log(actZone)
                        zoneCreated = true;
                      }
                      data2=await database.setDevice(info[2]+"_ta",info[0]+info[2]+info[8]+"ta"+i+randomInt(10000),actZone,"ta")
                    }else if( info.length <= 5){
                      
                      if(data2!= undefined && info[2]!=null && info[0] != null){
                        console.log("InserData")
                        await database.updateDevice(data2,"ta",info[2],info[0]+"T"+info[1])
                      }
                    }
                  }
                } catch (err) {
                  console.error('Error reading file:', err);
                }
              } else if (device.includes("_sm_")) {
                try {
                  let data = await fs.readFile(path.join(zonePath, device), 'utf8');
                  let lines = data.split('\n');
                  for (let line of lines) {
                    let info = line.split(' ').filter(function (el) {return el != '';});
                    if (info.length > 5) {
                      if(!zoneCreated){
                        actZone= await database.setZone(zone, await getCountry(info[3],info[4]),info[3],info[4],actpanel);
                        console.log(actZone)
                        zoneCreated = true;
                      }
                      data2=await database.setDevice(info[2]+"_sm",info[0]+info[2]+info[8]+"sm"+i+randomInt(10000),actZone,"sm")
                    }else if( info.length <= 5){
                      if( data2!= undefined && info[2]!=null && info[0] != null){
                        console.log("InserData")
                        await database.updateDevice(data2,"sm",info[2],info[0]+"T"+info[1])
                      }
                    }
                  }
                } catch (err) {
                  console.error('Error reading file:', err);
                }
              } else {
                //console.log(device);
              }
            }
          }
        }
      }
    }
  } catch (err) {
    console.log('Unable to scan directory: ' + err);
  }
}

processPanels();

