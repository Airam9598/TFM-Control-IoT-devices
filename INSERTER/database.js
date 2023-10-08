const mysql = require("mysql");
const util = require('util');
const moment = require('moment');
var mongoClient = require("mongodb").MongoClient;
const { ObjectId } = require('mongodb');

var server = "mongodb://127.0.0.1:27017";


// Creating connection
let db_con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "riego"
});
  
// Connect to MySQL server
db_con.connect((err) => {
  if (err) {
    console.log("Database Connection Failed !!!", err);
  } else {
    console.log("connected to Database");
  }
});

const db_query = util.promisify(db_con.query).bind(db_con);

async function updateDevice(id,type,value,date) {
  const types = {
    'sm': 'soil Moisture',
    'ta': 'air temperature',
    'ts': 'soil temperature'
  };

  try {
    const client2 = await mongoClient.connect(server);

    const db2 = client2.db('riegoDev');
    const devices = db2.collection("device");
    let result = await devices.findOne({ _id: new ObjectId(id) })
    result.data[types[type]].push({"value":value,"date":new Date(moment(date, "YYYY/MM/DDTHH:mm").toISOString())})
    await devices.updateOne(
      { _id: new ObjectId(id) },
      { $set: result }
    );
    client2.close();
  } catch (error) {
    console.log("Error while connecting to databases: ", error);
    //throw error;
  }
}

async function setDevice(name, dev_id, zone_id, type) {
  const types = {
    'sm': 'soil Moisture',
    'ta': 'air temperature',
    'ts': 'soil temperature'
  };

  let device = {
    "data": {
      [types[type]]: []
    }
  };

  try {
    const client2 = await mongoClient.connect(server);

    const db2 = client2.db('riegoDev');
    const devices = db2.collection("device");
    let result = await devices.insertOne(device);
    let insertedDeviceId = result.insertedId.toString().replace('new ObjectId("',"").replace('")','');

    client2.close();

    const query = `INSERT INTO devices (name, data_id, dev_id, zone_id) VALUES (?, ?, ?, ?);`;

    let mysqlResult = await db_query(query, [name, insertedDeviceId, dev_id, zone_id]);
    const query2 = `INSERT INTO detect (dev_id, type_id) VALUES (?, ?);`;
    let devType
    if(type=="sm"){
      devType=1
    }else if(type=="ta"){
      devType=3
    }else if(type=="ts"){
      devType=2
    }

    const mysqlResult2 = await db_query(query2, [mysqlResult.insertId,devType]);
    return insertedDeviceId;
  } catch (error) {
    console.log("Error while connecting to databases: ", error);
    //throw error;
  }
}

async function setZone(name,country,lat,lng,panel){
    let traductor={
      "United States" :"Estados Unidos"
    }
    const query = `INSERT INTO zones (name,country,lat,lng,panel_id) VALUES (?, ?, ?, ?,?);`;
    country=traductor[country] ?? country 
    try {
      const result = await db_query(query, [name,country,lat,lng,panel]);
      return result.insertId;
    } catch (err) {
      console.error('Error inserting panel:', err);
      //throw err;
    }
}

  async function setPanel(name) {

    const query = `INSERT INTO panels (name,diference_days) VALUES (?, ?)`;

    try {
      const result = await db_query(query, [name,0]);
      const query2 = `INSERT INTO own (user_id,panel_id) VALUES (?, ?)`;

      try {
        const result2 = await db_query(query2, [1,result.insertId]);
      } catch (err) {
        console.error('Error inserting panel:', err);
        //throw err;
      }
      return result.insertId;
    } catch (err) {
      console.error('Error inserting panel:', err);
      //throw err;
    }


  }

module.exports = { db_con,setZone,setPanel,setDevice,updateDevice } ;
