var Spooky = require('spooky');
var _ = require('lodash');

async function scrapeData(req, res, next) {
  console.log('beginning Florida scraping process...');

  if ((req.query.host).indexOf("sunbiz") !== -1) {

    var domainLink = "http://search.sunbiz.org/Inquiry/CorporationSearch/ByName"; // Link to be scrap

    const keywordName = req.query.keyword; // Key parameter to pass
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


      spooky.start(domainLink);
      spooky.then([
        { keyword: keywordName },
        function() {
          this.emit('message', 'looking for Department with name ' + keyword);

          this.thenEvaluate(function(term) {
            document.querySelector('input#SearchTerm').setAttribute('value', term);
            document.querySelector('div#search-input>form').submit(); // Submit form event
          }, keyword);
        }
      ]);

      spooky.waitFor(function() {

        // Capture image to see if scrapped output is perfect or not
        // this.captureSelector('check.png','div#search-results>table');

        this.captureSelector('check.png', 'div#main');
        return (this.exists('div#main'));
      }, function() {
        // then

      }, function() {
        // timeout
        this.emit('message', 'Timeout occurred');
      }, 3000);

      spooky.then([
        { domainLink: domainLink },
        function() {
          //do some casper js stuff
          if (this.exists('div#main')) {
            var info = this.evaluate(function(domainLink) {
              var table_rows = document.querySelectorAll("div#search-results>table>tbody>tr"); //or better selector
              return Array.prototype.map.call(table_rows, function(tr) {
                return {
                  CorpName: tr.querySelector("td.large-width").textContent, // Corporate Name
                  link: "http://search.sunbiz.org" + tr.querySelector("td.large-width a").getAttribute('href'), // Corporate Link
                  DocNum: tr.querySelector("td.medium-width").textContent, // Document Number
                  Status: tr.querySelector("td.small-width").textContent // Status
                };
              });
            }, domainLink);
            // this.emit('message', info);
            this.emit('finalResult', info);
          } else {
            this.emit('noResult', 'No data available');
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
      result = _.take(result, 10);
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
  }
};




async function scrapeDetails(req, res, next) {
  console.log('beginning Florida detail scraping process...');


  console.log(req.query, "query working");
  if ((req.query.link) && (req.query.link).indexOf("sunbiz") !== -1) {
    // var domainLink = "http://search.sunbiz.org/Inquiry/CorporationSearch/ByName";
    const link = 'http://search.sunbiz.org/Inquiry/CorporationSearch/SearchResultDetail?inquirytype=EntityName&directionType=Initial&searchNameOrder=CHECK%20P940000516110&aggregateId=domp-p94000051611-307c908c-26f4-4c94-ad55-671bc72465ab&searchTerm=check&listNameOrder=CHECK%202263670';
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
        return (this.exists('div.searchResultDetail'));
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

          if (this.exists('div.searchResultDetail')) {
            var info = this.evaluate(function() {
              var tables = document.querySelectorAll("div.searchResultDetail");
              return Array.prototype.map.call(tables, function(table) {

                var table_rows = table.querySelectorAll('div.filingInformation>span:nth-child(2)>div');
                var detailData = Array.prototype.map.call(table_rows, function(tr) {
                  var returnObj = {};
                  var even = [];
                  var odd = [];
                  for (var i = 0; i < tr.children.length; i++) {
                    if (i % 2 == 0) {
                      even.push(tr.children[i].textContent);
                    } else {
                      odd.push(tr.children[i].textContent);
                    }
                  }
                  even.forEach(function(value, index){
                      returnObj[value] = odd[index]
                  });

                  return returnObj;
                });

                var table_rows1 = table.querySelectorAll('div:nth-child(8)>table>tbody');
                var annualDetail = Array.prototype.map.call(table_rows1, function(tr) {
                  var annualObj = {};
                  var annualArr = [];
                  var annualArr1 = [];
                  for (var i = 1; i < tr.children.length; i++) {
                      annualArr1.push(tr.children[i].textContent.split("\n")[1]);
                      annualArr.push(tr.children[i].textContent.split("\n")[2]);
                  }

                  annualArr1.forEach(function(value, index){
                      annualObj[value] = annualArr[index]
                  });
                  return annualObj;
                });


                // var table_rows2 = table.querySelectorAll('div:nth-child(10)>table');
                // var Documents = Array.prototype.map.call(table_rows2, function(tr) {
                //   var docObj = {};

                // // docObj.name = tr.children.length;
                //   return tr.children[1].textContent;
                // });


                return {
                  PrincipalAddress    : (table.querySelector('div:nth-child(4)>span:nth-child(2)>div').textContent).replace(/(\n)/g,"") + (table.querySelector('div:nth-child(4)>span:nth-child(4)').textContent).replace(/(\n)/g,""),
                  filingInformation   : detailData,
                  title               : table.querySelector('h2').textContent,
                  CorpName            : table.querySelector('p:nth-child(1)').textContent,
                  MailingAddress      : (table.querySelector('div:nth-child(5)>span:nth-child(2)>div').textContent).replace(/(\n)/g,"") + (table.querySelector('div:nth-child(5)>span:nth-child(4)').textContent).replace(/(\n)/g,""),
                  agentName           : (table.querySelector('div:nth-child(6)>span:nth-child(2)').textContent).replace(/(\n)/g,""),
                  // agentAddress        : table.querySelector('div:nth-child(6)>span:nth-child(3)>div').textContent
                  officerName         : table.querySelector('div:nth-child(7)>span:nth-child(5)').textContent,
                  // officerAddress      : table.querySelector('div:nth-child(7)>span:nth-child(8)').textContent,
                  Anuual_Report       : annualDetail,
                  Documents_Image     : (table.querySelector('div:nth-child(10)>table>tbody').textContent).replace(/(\n)/g,"")

                }
              });
            });
            // // this.emit('message', info);

            this.emit('finalResult', info);
          } else {
            this.emit('noResult', 'No data available');
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
