var Spooky = require('spooky');
var _ = require('lodash');

async function scrapeData(req, res, next) {
  console.log('beginning bsd.sos.in.gov scraping process...', req.body);

  if ((req.body.host).indexOf("bsdsos") !== -1) {

    var domainLink = "https://bsd.sos.in.gov/publicbusinesssearch"; // Link to be scrap

    const keywordName = req.body.businessname; // Key parameter to pass
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


      spooky.start(domainLink);
      spooky.then([
        { keyword: keywordName },
        function () {
          this.emit('message', 'looking for Department with name ' + keyword);

          this.thenEvaluate(function (term) {
            document.querySelector('input#txtBusinessName').setAttribute('value', term);
            document.querySelector('input#btnSearch').click(); // Submit form event
          }, keyword);
        }
      ]);

      spooky.waitFor(function () {

        // Capture image to see if scrapped output is perfect or not
        // this.captureSelector('check.png','div#search-results>table');

        this.captureSelector('check.png', 'div.data_pannel>table>tbody>tr:nth-child(3)');
        //return (this.exists('div'));
      }, function () {
        // then

      }, function () {
        // timeout
        this.emit('message', 'Timeout occurred');
      }, 3000);

      spooky.then([
        { domainLink: domainLink },
        function () {
          //do some casper js stuff
          if (this.exists('div#businessSearchResult')) {
            var info = this.evaluate(function (domainLink) {
              var table_rows = document.querySelectorAll("div.data_pannel>table>tbody>tr>td>div#businessSearchResult>table#grid_businessList>tbody"); //or better selector
              return Array.prototype.map.call(table_rows, function (tr) {
                var obj = {};
                //var dataArray = tr.children.length;
                var dataArray = [];
                for (var i = 1; i <= tr.children.length; i++) {
                  obj = {
                    "BusinessID": tr.querySelector('table#grid_businessList>tbody>tr:nth-child(' + i + ')>td:nth-child(1)').textContent.trim(),
                    "Link": "https://bsd.sos.in.gov" + tr.querySelector('table#grid_businessList>tbody>tr:nth-child(' + i + ')>td:nth-child(1) > a').getAttribute('href'),
                    "BusinessName": tr.querySelector('table#grid_businessList>tbody>tr:nth-child(' + i + ')>td:nth-child(2)').textContent.trim(),
                    "NameType": tr.querySelector('table#grid_businessList>tbody>tr:nth-child(' + i + ')>td:nth-child(3)').textContent.trim(),
                    "EntityType": tr.querySelector('table#grid_businessList>tbody>tr:nth-child(' + i + ')>td:nth-child(4)').textContent.trim(),
                    "PrincipalOfficeAddress": tr.querySelector('table#grid_businessList>tbody>tr:nth-child(' + i + ')>td:nth-child(5)').textContent.trim(),
                    "RegisteredAgentName": tr.querySelector('table#grid_businessList>tbody>tr:nth-child(' + i + ')>td:nth-child(6)').textContent.trim(),
                    "Status": tr.querySelector('table#grid_businessList>tbody>tr:nth-child(' + i + ')>td:nth-child(7)').textContent.trim(),
                  };
                  dataArray.push(obj);
                }
                return {
                  dataArray
                };
              });
            }, domainLink);
            // this.emit('message', info);
            this.emit('finalResult', info);
          } else {
            //this.emit('noResult', 'No data available');
          }
        }
      ]);

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
    console.log('beginning Florida detail scraping process...');


    console.log(req.query, "query working");
    if ((req.query.link) && (req.query.link).indexOf("bsdsos") !== -1) {
      // var domainLink = "http://search.sunbiz.org/Inquiry/CorporationSearch/ByName";
      const link = 'https://bsd.sos.in.gov/PublicBusinessSearch/BusinessInformation?businessId=' + req.query.businessid;
      // const link = req.query.link;

      var spooky = new Spooky({
        child: {
          transport: 'http'
        },
        casper: {
          logLevel: 'debug',
          verbose: true
        }
      }, function(err) {
        if (err) {
          e = new Error('Failed to initialize SpookyJS');
          e.details = err;
          throw e;
        }

        spooky.start(link)
        spooky.waitFor(function() {
          //  this.emit('message', 'loading...');
          this.captureSelector('check.png', 'div.data_pannel');
 
          //return (this.exists('div.data_pannel'));
        }, function() {
          // then

        }, function() {
          // timeout
          this.emit('message', 'Timeout occurred');
        }, 3000);

        spooky.then([
          { link: link },
          function() {
            this.emit('message', 'looking Corporation details for ' + link);

            if (this.exists('div.data_pannel')) {
              var info = this.evaluate(function (link) {
                var table_rows = document.querySelectorAll("body>table>tbody"); //or better selector
                return Array.prototype.map.call(table_rows, function (tr) {
                  var obj = {};
                  var registeredAgentInformationObj = {};
                  var dataArray = tr.children.length;
                    
                    var businessRows = document.querySelectorAll("body>table>tbody");
                    var businessInfo = Array.prototype.map.call(businessRows, function(tr) {
                    obj = { 
                        "businessName" : tr.querySelector('tr:nth-child(1)>td>div>table>tbody>tr:nth-child(2)>td:nth-child(2)').textContent.trim(),
                        "businessId" : tr.querySelector('tr:nth-child(1)>td>div>table>tbody>tr:nth-child(2)>td:nth-child(4)').textContent.trim(),
                        "entityType" : tr.querySelector("tr:nth-child(1)>td>div>table>tbody>tr:nth-child(3)>td:nth-child(2)").textContent.trim(),
                        "businessStatus" : tr.querySelector("tr:nth-child(1)>td>div>table>tbody>tr:nth-child(3)>td:nth-child(4)").textContent.trim(),
                        "principalOfficeAddress" : tr.querySelector("tr:nth-child(1)>td>div>table>tbody>tr:nth-child(5)>td:nth-child(2)").textContent.trim(),
                        "expirationDate" : tr.querySelector("tr:nth-child(1)>td>div>table>tbody>tr:nth-child(5)>td:nth-child(4)").textContent.trim(),
                        "jurisdictionofFormation" : tr.querySelector("tr:nth-child(1)>td>div>table>tbody>tr:nth-child(6)>td:nth-child(2)").textContent.trim(),
                        "businessEntityReportDueDate" : tr.querySelector("tr:nth-child(1)>td>div>table>tbody>tr:nth-child(6)>td:nth-child(4)").textContent.trim(),
                        "yearsDue" : tr.querySelector("tr:nth-child(1)>td>div>table>tbody>tr:nth-child(8)>td:nth-child(4)").textContent.trim()                        
                      };
                    });
                    //obj = tr.children.length;

                    if(tr.children.length==5)
                    {
                      registeredAgentInformationObj={
                        "type" : tr.querySelector("tr:nth-child(4)>td>div>table>tbody>tr:nth-child(2)>td:nth-child(2)").textContent.trim(),
                        "name" : tr.querySelector("tr:nth-child(4)>td>div>table>tbody>tr:nth-child(3)>td:nth-child(2)").textContent.trim(),
                        "address" : tr.querySelector("tr:nth-child(4)>td>div>table>tbody>tr:nth-child(4)>td:nth-child(2)").textContent.trim()
                      }
                    }
                    if(tr.children.length==4){
                      registeredAgentInformationObj={
                        "type" : tr.querySelector("tr:nth-child(3)>td>div>table>tbody>tr:nth-child(2)>td:nth-child(2)").textContent.trim(),
                        "name" : tr.querySelector("tr:nth-child(3)>td>div>table>tbody>tr:nth-child(3)>td:nth-child(2)").textContent.trim(),
                        "address" : tr.querySelector("tr:nth-child(3)>td>div>table>tbody>tr:nth-child(4)>td:nth-child(2)").textContent.trim()
                      }
                    }
                    if(tr.children.length==3){
                      registeredAgentInformationObj={
                        "type" : tr.querySelector("tr:nth-child(2)>td>div>table>tbody>tr:nth-child(2)>td:nth-child(2)").textContent.trim(),
                        "name" : tr.querySelector("tr:nth-child(2)>td>div>table>tbody>tr:nth-child(3)>td:nth-child(2)").textContent.trim(),
                        "address" : tr.querySelector("tr:nth-child(2)>td>div>table>tbody>tr:nth-child(4)>td:nth-child(2)").textContent.trim()
                      }
                    }

                    var principalInformationRows = document.querySelectorAll("#grid_principalList > tbody");
                    var principal_arr = [];
                    var principalInformationData = Array.prototype.map.call(principalInformationRows, function(tr) {
                        for(var i = 1; i <= tr.children.length; i++){
                            var dataObject = {
                                "title": tr.querySelector('tr:nth-child('+i+')>td:nth-child(1)').textContent,
                                "name": tr.querySelector('tr:nth-child('+i+')>td:nth-child(2)').textContent,
                                "address": tr.querySelector('tr:nth-child('+i+')>td:nth-child(3)').textContent
                            };
                            principal_arr.push(dataObject);
                        }
                    });

                    var incorporatorsInformationRows = document.querySelectorAll("#grid_incorporatoslist > tbody");
                    var incorporators_arr = [];
                    var incorporatorsInformationData = Array.prototype.map.call(incorporatorsInformationRows, function(tr) {
                        for(var i = 1; i <= tr.children.length; i++){
                            var dataObject = {
                                "title": tr.querySelector('tr:nth-child('+i+')>td:nth-child(1)').textContent,
                                "name": tr.querySelector('tr:nth-child('+i+')>td:nth-child(2)').textContent,
                                "address": tr.querySelector('tr:nth-child('+i+')>td:nth-child(3)').textContent
                            };
                            incorporators_arr.push(dataObject);
                        }
                    });

                  return {
                    businessDetails : obj,
                    principalInformation : principal_arr,
                    incorporatorsInformation : incorporators_arr,
                    registeredAgentInformation : registeredAgentInformationObj
                  };
                });
              }, link);
              // this.emit('message', info);
              this.emit('finalResult', info);
            } else {
              //this.emit('noResult', 'No data available');
            }
          }
        ]);

        spooky.run();
      });

      spooky.on('error', function(e, stack) {
        console.error("Error", e);

        if (stack) {
          console.log("stack", stack);
        }
        res.json({ error: e });
      });

      spooky.on('message', function(greeting) {
        console.log(greeting);
      });

      spooky.on('finalResult', function(result) {
        result = _.compact(result);
        res.json({ data: result });
      });

      spooky.on('noResult', function(result) {
        res.json({ message: result });
      });

      spooky.on('log', function(log) {
        if (log.space === 'remote') {
          console.log(log.message.replace(/ \- .*/, ''));
        }
      });
    } else {
      res.json({ message: "Host name mismatch" });
    }
};

export default {
  scrapeData: scrapeData,
  scrapeDetails: scrapeDetails
};
