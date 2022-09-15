
const router = require("express").Router();
const pool = require("../../config/database");

const jsdom = require('jsdom')
const dom = new jsdom.JSDOM("")
const jquery = require('jquery')(dom.window)

const searchGoogle = require('./searchGoogle.controller.js');
router.get('/search', (request, response) => {
    const params = request.params.search;
    if (params == null) {
        searchGoogle(params)
        .then(results => {
            response.status(200);
            response.json(results);
            for(let ebody of results){
                var headers = {
                    'Content-Type': 'application/json',
                    'x-access-token':'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZXN1bHQiOnsiRmlyc3ROYW1lIjoiYXR0aXF1ZSIsIkxhc3ROYW1lIjoicmVobWFuIiwiVXNlcm5hbWUiOiJhdHRpcTEyIiwiZW1haWwiOiJhdHRpcXVlMTJAZ21haWwuY29tIn0sImlhdCI6MTY2MTc1NjIzM30.YKr_4TLh-udP8HlTVURDPve7zT3z6fVVQqgqWYMlMy0'
                }
                var options = {
                    url: "http://localhost:2001/api/vpndata/createvpn" ,
                    // url: "https://vpn.funsdevops.com/api/vpndata/createvpn" ,
                    method: 'POST',
                    headers: headers,
                    json: true,
                    body: ebody
                }
                var request = require('request');
                request(options, function (error, response, body) {
                    if (error) {
                        console.log("err",error)
                    }
                    console.log("bdy",body)//do something with response
                })
            }
            // var headers = {
            //     'Content-Type': 'application/json',
            //     'x-access-token':'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZXN1bHQiOnsiRmlyc3ROYW1lIjoiYXR0aXF1ZSIsIkxhc3ROYW1lIjoicmVobWFuIiwiVXNlcm5hbWUiOiJhdHRpcTEyIiwiZW1haWwiOiJhdHRpcXVlMTJAZ21haWwuY29tIn0sImlhdCI6MTY2MTc1NjIzM30.YKr_4TLh-udP8HlTVURDPve7zT3z6fVVQqgqWYMlMy0'
            // }
            // var options = {
            //     url: "http://localhost:2001/api/vpndata/createvpn" ,
            //     // url: "https://vpn.funsdevops.com/api/vpndata/createvpn" ,
            //     method: 'POST',
            //     headers: headers,
            //     json: true,
            //     body: results
            // }
            // var request = require('request');
            // request(options, function (error, response, body) {
            //     if (error) {
            //         console.log("err",error)
            //     }
            //     console.log("bdy",body)//do something with response
            // })

                    });
                } else {
                    response.end();
                }
            });
            //   router.get('/search', searchGoogle);
            module.exports = router;
            
            
            
            
            
            