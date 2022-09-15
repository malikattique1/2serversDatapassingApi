const cheerio = require('cheerio');

const searchGoogle = async () => {
  const request = require('request-promise');
  const response = await request('https://www.vpngate.net/en/')
  let $ = cheerio.load(response);
  scrapeItems = [];
  $('table#vg_hosts_table_id').eq(2).find('tr').each(function (element) {
    if($(this).find('td').eq(0).text().includes('(Physical location)')) {
      return
    }
    let countries = $(this).find('td').eq(0).text();
    let country= countries.trim();
    if(country=='Korea Republic of'){
      countryflag=`https://countryflagsapi.com/png/kor`;
    }else{
      countryflag=`https://countryflagsapi.com/png/${country}`;
    }
    let ipaddresses = $(this).find('td').eq(1).text()
    // let ipaddressext= ipaddresses.trim().split('net').join(',').split('(').join(',').split(',');
    let ipaddressext= ipaddresses.trim().split('net');

    const ipaddress = ipaddressext[1];
    
    let hostnames = $(this).find('td').eq(1).text();
    let hostnameext= hostnames.trim()
    const hostname = hostnameext.substring(0, hostnameext.indexOf(ipaddress));
    
    let sessions = $(this).find('td').eq(2).text();
    let sessionext= sessions.trim().split(' ');
    const session = sessionext[0];
    
    let users = $(this).find('td').eq(2).text();
    let usersext= users.trim().split('Total ');
    const user = usersext[1];
    
    let linequalities = $(this).find('td').eq(3);
    let linequalityext= linequalities.text().trim().split('Ping');
    const linequality = linequalityext[0];
    
    let pings = $(this).find('td').eq(3);
    let pingext= pings.text().trim().split(': ');
    const ping = pingext[1].substring(0,5);
    
    coccat='https://www.vpngate.net/en/'
    let ovpnss = $(this).find('td').eq(6).find('a').attr('href') ?  $(this).find('td').eq(6).find('a').attr('href') :false
    let ovpn=coccat+ovpnss
    
    let scores = $(this).find('td').eq(9).text().trim();
    scrapeItems.push ({
      country:country,
      countryflag:countryflag,
      hostname:hostname,
      ipaddress:ipaddress,
      vpnsessions:session,
      users:user,
      linequality:linequality,
      ovpn:ovpn,
      ping:ping,
      score:scores,
    })
  });
  // console.log(scrapeItems)
  searchResults=scrapeItems
  console.log("firstpage",searchResults);
  
  var workingipsarr=[]
  queryPromise1 = () =>{
    return new Promise((resolve, reject)=>{
      var ping = require('ping');
      searchResults.forEach(async function (searchResult,i) {
        length=searchResults.length-1;
        ping.promise.probe(searchResult.ipaddress)
        .then(function (res) {
          console.log(res.alive);
          if(res.alive==true){
            workingipsarr.push(searchResult.ipaddress);
            if (i == length) {
              return resolve(workingipsarr);
            }
          }else if(res.alive==false){
            if (i == length) {
              return resolve(workingipsarr);
            }
            return
          }
        });
      });
      
    });
  }
  
  var workingIpsInSiteSearchResults = await queryPromise1();
  console.log("workingIpsInSiteSearchResults",workingIpsInSiteSearchResults);
  // return
  let filteredSearchResultsWithWorkingIps = searchResults.filter((f) => workingIpsInSiteSearchResults.includes(f.ipaddress))
  // console.log("filteredSearchResultsWithWorkingIps",filteredSearchResultsWithWorkingIps)
  //return
  ///////////////////////////////////////////for next page scraping////////////////////////////////////////////
  let nextpagelinks=[]
  filteredSearchResultsWithWorkingIps.forEach(function (searchResult) {
    nextpagelinks.push(searchResult.ovpn)
  });
  console.log("nextpagelinks",nextpagelinks);
  // return
  let datafromnextpageObjArr=[]
  for(let link of nextpagelinks){
    if (link=='https://www.vpngate.net/en/false'){
    datafromnextpageObjArr.push({ovpnfilelink:"false"})
  }
  else{
    const request = require('request-promise');
    const response = await request(link)
    let $ = cheerio.load(response);
    const ovpnfilelink= $('ul.listBigArrow > li > a').attr('href')
    coccat='https://www.vpngate.net'
    console.log("downl",coccat+ovpnfilelink)
    datafromnextpageObjArr.push({ovpnfilelink:coccat+ovpnfilelink})
  }
}
console.log("2nd page",datafromnextpageObjArr);
// return
let prefinalresultObjMap = filteredSearchResultsWithWorkingIps.map((item, i) => Object.assign({}, item, datafromnextpageObjArr[i])); 
console.log("prefinalresultObjMap", prefinalresultObjMap);
return prefinalresultObjMap

};
module.exports = searchGoogle;
