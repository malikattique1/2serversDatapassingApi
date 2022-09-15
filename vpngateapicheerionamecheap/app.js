require("dotenv").config();
const express = require("express");
const app = express();
const userRouter = require("./api/vpngate/vpngate.router");
app.use(express.json());
const path = require('path')
app.use('/files', express.static(path.join(__dirname, 'files')))
app.use("/api/vpndata", userRouter);

time="0.1";
setInterval(function() {

sequentialQueries();  
const pool = require("./config/database");
function queryPromise1(){
  const pool = require("./config/database");
  pool.query(
    `DELETE FROM vpngate
    WHERE  ID NOT IN (SELECT MAX(ID)
                      FROM   vpngate
                      GROUP  BY ipaddress
                          
                      /*Even if ID is not null-able SQL Server treats MAX(ID) as potentially
                        nullable. Because of semantics of NOT IN (NULL) including the clause
                        below can simplify the plan*/
                      HAVING MAX(ID) IS NOT NULL) `,
    );
// const pool = require("./config/database");
  return new Promise((resolve, reject)=>{
    pool.query('select id,ipaddress,ovpnfilelink from vpngate',  (error, results)=>{
      if(error){
        return reject(error);
      }
      jsonobj=JSON.parse(JSON.stringify(results))
      return resolve(jsonobj);
    });
  });
}
async function sequentialQueries () {
  const resultdb = await queryPromise1();
  // console.log("querypromiseResultfromDB",resultdb)
  DbAllOnlyIpsDataArr=[];
  DB=resultdb.forEach (db => {
    // console.log("z",db)
    DbAllOnlyIpsDataArr.push({ip:db.ipaddress, ovpnfilelink:db.ovpnfilelink})
  });
  // console.log("DbAllOnlyIpsDataArr",DbAllOnlyIpsDataArr);
  var dbWorkingIpsArr=[]
  function queryPromise2(){
    return new Promise((resolve, reject)=>{
      var ping = require('ping');
      // var hosts = ['123.4'];
      DbAllOnlyIpsDataArr.forEach(function (dbObj,i) {
        length=DbAllOnlyIpsDataArr.length-1;
        ping.promise.probe(dbObj.ip)
        .then(function (res) {
          // console.log(res);
          // console.log(res.alive);
          if(res.alive==true){
            dbWorkingIpsArr.push({workingip:dbObj.ip , itsovpnlink:dbObj.ovpnfilelink});
            // console.log("s",dbWorkingIpsArr);
            if (i == length) {
              return resolve(dbWorkingIpsArr);
            }
          }
          else if(res.alive==false){
            if (i == length) {
              return resolve(workingipsarr);
            }
            return
          }
          
        });
      });
      
    });
  }
  var DbAllWorkingIpsArr = await queryPromise2();
  console.log("DbAllWorkingIpsArr",DbAllWorkingIpsArr);
  
  ovpndownloadpathObjArr=[]
  var https = require('https');
  // const fs = require('fs');
  DbAllWorkingIpsArr.forEach((workingObj , index) => {
    const fs = require('fs');
    filename=`${workingObj.workingip}.ovpn`
    ovpndownloadpath='https://vpn.funsdevops.com/files/'+filename
    // console.log("dddd",ovpndownloadpath)
    const pool = require("./config/database");
      pool.query(
        `update vpngate set ovpndownloadpath= '${ovpndownloadpath}' where ipaddress= '${[workingObj.workingip]}'`,
        );

    ovpndownloadpathObjArr.push({ovpndownloadpath});

    // console.log(website);
    if (workingObj.itsovpnlink== "false"){
      console.log("falselink")
      return
      // console.log("workingaipWithnofile",url.workingObj);
      // fs.createWriteStream(`./files/${[workingObj.workingip]}.ovpn`);
     
    }
    else{
      const fs = require('fs');
      https.get(workingObj.itsovpnlink, res => {
        const stream = fs.createWriteStream(`./files/${[workingObj.workingip]}.ovpn`);
        res.pipe(stream);
        stream.on('finish', () => {
          stream.close();
        })
      })
    }
  });
  
  function getDifference(DbAllOnlyIpsDataArr, DbAllWorkingIpsArr) {
    return DbAllOnlyIpsDataArr.filter(object1 => {
      return !DbAllWorkingIpsArr.some(object2 => {
        return object1.ip === object2.ip;
      });
    });
  }
  // console.log("fdfsdf",getDifference(DbAllOnlyIpsDataArr, DbAllWorkingIpsArr));
  filteredIpsNotworkinginDb=getDifference(DbAllOnlyIpsDataArr, DbAllWorkingIpsArr)
  
  
  const fs = require('fs');
  filteredIpsNotworkinginDb.forEach((objx , index) => {
  // const fs = require('fs');
    console.log(index)
    // deleting not working ips record from directory
    var filePath = `./files/${objx.ip}.ovpn`; 
    if(!fs.existsSync(filePath)) {
      console.log("File not found");
    }else{
      fs.unlinkSync(filePath);
    }
    // deleting not working ips record from db
    pool.query(
      `delete from vpngate where ipaddress = ${[objx.ip]}`,
      );
    });

  }

},time*60*1000)


// app.listen();

const port = process.env.APP_PORT;
app.listen(port, () => {
  console.log("server up and running on PORT :", port);
});
