const pool = require("../../config/database");
module.exports = {
  
  
  createuser: (data, callBack) => {
    pool.query("SELECT username FROM users WHERE Username= ?", [data.Username], function (err, rows,fields){
      if (err) throw err;
      if (rows.length) {
        console.log(rows[0].username+" already exists");
        //username starts with small letter auto in db 
        return callBack(null, rows[0].username+" already exists");
      }
      else{
        console.log('Success...');
        pool.query(
          `insert into users(FirstName,LastName,Username,email,password ) 
          values(?,?,?,?,?)`,
          [
            data.FirstName,
            data.LastName,
            data.Username,
            data.email,
            data.password,
          ],
          (error, results, fields) => {
            if (error) {
              callBack(error);
            }
            return callBack(null, "Signup Successfully");
          }
          );
        }
      });
    },
    loginuserbyemail: (email, callBack) => {
      pool.query(
        `select FirstName,LastName,Username,email,password from users where email = ?`,
        [
          email
        ],
        (error, results, fields) => {
          if (error) {
            callBack(error);
          }
          return callBack(null, results[0]);
        }
        );
      },
      
      
      createvpns: (data, callBack) => {
        // console.log("f",data);
        pool.query(
          `insert into vpngate(country,countryflag,hostname,ipaddress,vpnsessions,users,linequality,ping,score,ovpnfilelink) 
          values(?,?,?,?,?,?,?,?,?,?)`,
          [
            `${[data.country]}`,
            `${[data.countryflag]}`,
            `${[data.hostname]}`,
            `${[data.ipaddress]}`,
            `${[data.vpnsessions]}`,
            `${[data.users]}`,
            `${[data.linequality]}`,
            `${[data.ping]}`,
            `${[data.score]}`,
            `${[data.ovpnfilelink]}`,
          ],
          (error, results, fields) => {
            if (error) {
              callBack(error);
            }
            return callBack(null, results);
          }
          );
          
          
        },
        
        
        
        
        getvpns: callBack => {
          pool.query(
            `select id,country,countryflag,countrycode,regionname,ipaddress,hostname,vpnsessions,linequality,ping,score,portno,totaldownloads,createdat,updatedat from vpngate`,
            [],
            (error, results, fields) => {
              if (error) {
                callBack(error);
              }
              return callBack(null, results);
            }
            );
          },
          
          getvpnlinkfromid: (id, callBack) => {
            pool.query(
              `select id,ipaddress,ovpndownloadpath from vpngate WHERE id = ?`,
              [id],
              (error, results, fields) => {
                if (error) {
                  return callBack(error);
                }
                console.log("eee",results[0]);
                console.log("e",results);
                // return callBack(null,results[0])
                if(results[0]){
                  var ping = require('ping');
                  ping.promise.probe(results[0].ipaddress)
                  .then(function (res) {
                    // console.log(res);
                    // console.log(res.alive);
                    if(res.alive==true){
                      return callBack(null, results[0]);
                    }
                    else if(res.alive==false){
                      return callBack(null, "Error pinging");
                    }
                    
                  });
                  
                }else{
                  return callBack(null, "no result found");
                }
              }
              );
            },
            
            
          };
          