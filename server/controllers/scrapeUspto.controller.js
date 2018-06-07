
var Spooky = require('spooky');
var _ = require('lodash');

async function scrapeData(req, res, next) {
  console.log('beginning bsd.sos.in.gov scraping process...https://teas.uspto.gov/forms/teasplus');

  if ((req.body.host).indexOf("uspto") !== -1) {
    console.log("1===>",req.body.ownerName);
    var domainLink = "https://teas.uspto.gov/forms/teasplus"; // Link to be scrap
    var data = req.body;
    const keywordName = "harish"; // Key parameter to pass
    var spooky = new Spooky({
      child: {
        transport: 'http'
      },
      casper: {
        logLevel: 'debug',
        verbose: true
      }
    }, function (err) {
      if (err) {
        e = new Error('Failed to initialize SpookyJS');
        e.details = err;
        throw e;
      }

      spooky.start(domainLink, function() {
        //console.log("===>",req.body.ownerName);
        this.capture('start.png');
      });
      spooky.then([
        { keyword: keywordName },
        function () {

            this.emit('message', 'looking for Department with name ' + keyword);
            this.thenEvaluate(function (term) {
                document.querySelector('input.button').click(); // Submit form event
            }, keyword);
        }
      ]);

      spooky.waitFor(function () {
        //this.capture('harish.png');
        //return (this.exists('td.ct-active>form:nth-child(1)>table>tbody>tr:nth-child(3)>td'));
      }, function () {
        // then

      }, function () {
        // timeout
        this.emit('message', 'Timeout occurred');
      }, 3000);


      spooky.then([
        { data: data },
        function () {       
            this.thenEvaluate(function (datas) {
                document.getElementById('form.owner[0].ownerName').value = datas.ownerName;
                document.getElementById('form.owner[0].dbaakatext').value = datas.dbaakatext;
                document.getElementById('form.owner[0].internalAddr').value = datas.internalAddr;
                document.getElementById('form.owner[0].streetAddr').value = datas.streetAddr;
                document.getElementById('form.owner[0].city').value = datas.city;
                document.getElementById('form.owner[0].zipCode').value = datas.zipCode;
                document.getElementById('phone_0').value = datas.phone_0;
                document.getElementById('ext_0').value = datas.ext_0;
                document.getElementById('form.owner[0].fax').value = datas.fax;
                document.getElementById('form.owner[0].email').value = datas.email;
                document.getElementById('form.owner[0].website').value = datas.website;
                document.getElementById('form.owner[0].stateList').value = datas.stateList;
                document.getElementById('form.owner[0].country').value = datas.country;
                document.getElementById('selectclass').value = datas.countryPhoneCode;
                if(datas.ownerindividual=='Yes'){
                  document.getElementById('owner.individual').click()
                }

                
            },data); 

        }
      ]);
        
        if(data.ownerindividual=='Yes'){
          spooky.waitForSelector('div#entity>table>tbody>tr>td>table>tbody>tr>th>label', function() {
            
            this.thenEvaluate(function(){
              // var esd = document.getElementById("form.owner[0].citizenship"); //Get the element
              // esd.setAttribute("id", "div3");             
              //document.querySelector('form.owner[0].citizenship').selectedIndex = 2
              
              // var esd = document.getElementById("form.owner[0].fax"); //Get the element
              // esd.setAttribute("id", "div3");
              // //document.querySelector('form.owner[0].citizenship').selectedIndex = 2
              // document.getElementById('div3').value = 'DZX';
            });
            this.capture('first.png');         
          }, function(){
            
          }
        
          );

          spooky.then([
            { data: data },
            function () {       
                this.thenEvaluate(function (datas) {
                  document.getElementById('form.owner[0].citizenship').value = 'ALX';
                },data); 
    
            }
          ]);

        }

        spooky.waitFor(function () {
          this.capture('harish.png');
          //return (this.exists('#entity'));
        }, function () {
          // then
          this.capture('harish1.png');
        }, function () {
          // timeout
          this.emit('message', 'Timeout occurred');
        }, 3000);

      // spooky.waitFor(function () {
      //   this.capture('harish.png');
      //   return (this.exists('#entity'));
      // }, function () {
      //   // then
      //   this.capture('harish1.png');
      // }, function () {
      //   // timeout
      //   this.emit('message', 'Timeout occurred');
      // }, 3000);

      spooky.run();
    });


    spooky.on('error', function (e, stack) {
      console.error("Error", e);

      if (stack) {
        console.log("stack", stack);
      }
      res.json({ error: e });
    });

    spooky.on('message', function (greeting) {
      console.log(greeting);
    });

    spooky.on('finalResult', function (result) {
      result = _.take(result, 10);
      res.json({ data: result });
    });

    spooky.on('noResult', function (result) {
      res.json({ message: result });
    });

    spooky.on('log', function (log) {
      if (log.space === 'remote') {
        console.log(log.message.replace(/ \- .*/, ''));
      }
    });
  }
};



async function scrapeDetails(req, res, next) {
    // console.log('beginning Florida detail scraping process...');


    // console.log(req.query, "query working");
    // if ((req.query.link) && (req.query.link).indexOf("bsdsos") !== -1) {
    //   // var domainLink = "http://search.sunbiz.org/Inquiry/CorporationSearch/ByName";
    //   const link = 'https://bsd.sos.in.gov/PublicBusinessSearch/BusinessInformation?businessId=' + req.query.businessid;
    //   // const link = req.query.link;

    //   var spooky = new Spooky({
    //     child: {
    //       transport: 'http'
    //     },
    //     casper: {
    //       logLevel: 'debug',
    //       verbose: true
    //     }
    //   }, function(err) {
    //     if (err) {
    //       e = new Error('Failed to initialize SpookyJS');
    //       e.details = err;
    //       throw e;
    //     }

    //     spooky.start(link)
    //     spooky.waitFor(function() {
    //       //  this.emit('message', 'loading...');
    //       this.captureSelector('check.png', 'div.data_pannel');
 
    //       //return (this.exists('div.data_pannel'));
    //     }, function() {
    //       // then

    //     }, function() {
    //       // timeout
    //       this.emit('message', 'Timeout occurred');
    //     }, 3000);

    //     spooky.then([
    //       { link: link },
    //       function() {
    //         this.emit('message', 'looking Corporation details for ' + link);

    //         if (this.exists('div.data_pannel')) {
    //           var info = this.evaluate(function (link) {
    //             var table_rows = document.querySelectorAll("body>table>tbody"); //or better selector
    //             return Array.prototype.map.call(table_rows, function (tr) {
    //               var obj = {};
    //               var registeredAgentInformationObj = {};
    //               var dataArray = tr.children.length;
                    
    //                 var businessRows = document.querySelectorAll("body>table>tbody");
    //                 var businessInfo = Array.prototype.map.call(businessRows, function(tr) {
    //                 obj = { 
    //                     "businessName" : tr.querySelector('tr:nth-child(1)>td>div>table>tbody>tr:nth-child(2)>td:nth-child(2)').textContent.trim(),
    //                     "businessId" : tr.querySelector('tr:nth-child(1)>td>div>table>tbody>tr:nth-child(2)>td:nth-child(4)').textContent.trim(),
    //                     "entityType" : tr.querySelector("tr:nth-child(1)>td>div>table>tbody>tr:nth-child(3)>td:nth-child(2)").textContent.trim(),
    //                     "businessStatus" : tr.querySelector("tr:nth-child(1)>td>div>table>tbody>tr:nth-child(3)>td:nth-child(4)").textContent.trim(),
    //                     "principalOfficeAddress" : tr.querySelector("tr:nth-child(1)>td>div>table>tbody>tr:nth-child(5)>td:nth-child(2)").textContent.trim(),
    //                     "expirationDate" : tr.querySelector("tr:nth-child(1)>td>div>table>tbody>tr:nth-child(5)>td:nth-child(4)").textContent.trim(),
    //                     "jurisdictionofFormation" : tr.querySelector("tr:nth-child(1)>td>div>table>tbody>tr:nth-child(6)>td:nth-child(2)").textContent.trim(),
    //                     "businessEntityReportDueDate" : tr.querySelector("tr:nth-child(1)>td>div>table>tbody>tr:nth-child(6)>td:nth-child(4)").textContent.trim(),
    //                     "yearsDue" : tr.querySelector("tr:nth-child(1)>td>div>table>tbody>tr:nth-child(8)>td:nth-child(4)").textContent.trim()                        
    //                   };
    //                 });
    //                 //obj = tr.children.length;

    //                 if(tr.children.length==5)
    //                 {
    //                   registeredAgentInformationObj={
    //                     "type" : tr.querySelector("tr:nth-child(4)>td>div>table>tbody>tr:nth-child(2)>td:nth-child(2)").textContent.trim(),
    //                     "name" : tr.querySelector("tr:nth-child(4)>td>div>table>tbody>tr:nth-child(3)>td:nth-child(2)").textContent.trim(),
    //                     "address" : tr.querySelector("tr:nth-child(4)>td>div>table>tbody>tr:nth-child(4)>td:nth-child(2)").textContent.trim()
    //                   }
    //                 }
    //                 if(tr.children.length==4){
    //                   registeredAgentInformationObj={
    //                     "type" : tr.querySelector("tr:nth-child(3)>td>div>table>tbody>tr:nth-child(2)>td:nth-child(2)").textContent.trim(),
    //                     "name" : tr.querySelector("tr:nth-child(3)>td>div>table>tbody>tr:nth-child(3)>td:nth-child(2)").textContent.trim(),
    //                     "address" : tr.querySelector("tr:nth-child(3)>td>div>table>tbody>tr:nth-child(4)>td:nth-child(2)").textContent.trim()
    //                   }
    //                 }
    //                 if(tr.children.length==3){
    //                   registeredAgentInformationObj={
    //                     "type" : tr.querySelector("tr:nth-child(2)>td>div>table>tbody>tr:nth-child(2)>td:nth-child(2)").textContent.trim(),
    //                     "name" : tr.querySelector("tr:nth-child(2)>td>div>table>tbody>tr:nth-child(3)>td:nth-child(2)").textContent.trim(),
    //                     "address" : tr.querySelector("tr:nth-child(2)>td>div>table>tbody>tr:nth-child(4)>td:nth-child(2)").textContent.trim()
    //                   }
    //                 }

    //                 var principalInformationRows = document.querySelectorAll("#grid_principalList > tbody");
    //                 var principal_arr = [];
    //                 var principalInformationData = Array.prototype.map.call(principalInformationRows, function(tr) {
    //                     for(var i = 1; i <= tr.children.length; i++){
    //                         var dataObject = {
    //                             "title": tr.querySelector('tr:nth-child('+i+')>td:nth-child(1)').textContent,
    //                             "name": tr.querySelector('tr:nth-child('+i+')>td:nth-child(2)').textContent,
    //                             "address": tr.querySelector('tr:nth-child('+i+')>td:nth-child(3)').textContent
    //                         };
    //                         principal_arr.push(dataObject);
    //                     }
    //                 });

    //                 var incorporatorsInformationRows = document.querySelectorAll("#grid_incorporatoslist > tbody");
    //                 var incorporators_arr = [];
    //                 var incorporatorsInformationData = Array.prototype.map.call(incorporatorsInformationRows, function(tr) {
    //                     for(var i = 1; i <= tr.children.length; i++){
    //                         var dataObject = {
    //                             "title": tr.querySelector('tr:nth-child('+i+')>td:nth-child(1)').textContent,
    //                             "name": tr.querySelector('tr:nth-child('+i+')>td:nth-child(2)').textContent,
    //                             "address": tr.querySelector('tr:nth-child('+i+')>td:nth-child(3)').textContent
    //                         };
    //                         incorporators_arr.push(dataObject);
    //                     }
    //                 });

    //               return {
    //                 businessDetails : obj,
    //                 principalInformation : principal_arr,
    //                 incorporatorsInformation : incorporators_arr,
    //                 registeredAgentInformation : registeredAgentInformationObj
    //               };
    //             });
    //           }, link);
    //           // this.emit('message', info);
    //           this.emit('finalResult', info);
    //         } else {
    //           //this.emit('noResult', 'No data available');
    //         }
    //       }
    //     ]);

    //     spooky.run();
    //   });

    //   spooky.on('error', function(e, stack) {
    //     console.error("Error", e);

    //     if (stack) {
    //       console.log("stack", stack);
    //     }
    //     res.json({ error: e });
    //   });

    //   spooky.on('message', function(greeting) {
    //     console.log(greeting);
    //   });

    //   spooky.on('finalResult', function(result) {
    //     result = _.compact(result);
    //     res.json({ data: result });
    //   });

    //   spooky.on('noResult', function(result) {
    //     res.json({ message: result });
    //   });

    //   spooky.on('log', function(log) {
    //     if (log.space === 'remote') {
    //       console.log(log.message.replace(/ \- .*/, ''));
    //     }
    //   });
    // } else {
    //   res.json({ message: "Host name mismatch" });
    // }
};

export default {
  scrapeData: scrapeData,
  scrapeDetails: scrapeDetails
};
