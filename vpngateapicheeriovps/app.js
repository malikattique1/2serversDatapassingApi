require("dotenv").config();

const express = require("express");
const app = express();

const userRouter13 = require("./api/web_search_vpngate/searchGoogle.router");
app.use(express.json());

// app.use(express.static('files'))
// app.use('/files', express.static('files'))

const path = require('path')
app.use('/files', express.static(path.join(__dirname, 'files')))

app.use("/api/vpndata/scrapping", userRouter13);
time="10"; //5 min
setInterval(function() {
  var request = require('request');
  request('http://localhost:2000/api/vpndata/scrapping/search', function (error, response, body) {
  // request('https://vpn.funsdevops.com/api/vpndata/scrapping/search', function (error, response, body) {
  // request('https://www.downloadvid.app/vpn/api/vpndata/scrapping/search', function (error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log(body) 
  }
})
},time*60*1000)

// app.listen();
const port = process.env.APP_PORT;
app.listen(port, () => {
  console.log("server up and running on PORT :", port);
});
