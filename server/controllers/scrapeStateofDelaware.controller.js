var Spooky = require('spooky');
var _ = require('lodash');

async function scrapeData(req, res, next) {
  console.log('beginning State of Delaware scraping process...');

    console.log(req.query);

  if ((req.query.host).indexOf("delaware") !== -1) {

    var domainLink = "https://icis.corp.delaware.gov/Ecorp/EntitySearch/NameSearch.aspx"; // Link to be scrap

    const keywordName = req.query.keyword; // Key parameter to pass
    const searchType = req.query.type || '';
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
        { keyword: keywordName , searchType: searchType},
        function() {
          this.emit('message', 'looking for General Informartion of Delaware with name ' + keyword);

          this.thenEvaluate(function(term,type) {
          if (type == 'id') {
            document.querySelector('input#ctl00_ContentPlaceHolder1_frmFileNumber').setAttribute('value', term);
          } else {
            document.querySelector('input#ctl00_ContentPlaceHolder1_frmEntityName').setAttribute('value', term);
          }
            document.querySelector('input#ctl00_ContentPlaceHolder1_btnSubmit').click(); // Submit form event
          }, keyword , searchType);
        }
      ]);

      spooky.waitFor(function() {

        // Capture image to see if scrapped output is perfect or not
        // this.captureSelector('check.png','div#search-results>table');

        // this.captureSelector('check.png', 'table#tblResults>tbody>tr:nth-child(2)>td:nth-child(2)>a');
        return (this.exists('table#tblResults'));
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
          if (this.exists('table#TableBody>tbody>tr:nth-child(2)>td:nth-child(2)')) {
            var info = this.evaluate(function(domainLink) {
              var table_rows = document.querySelectorAll("table#tblResults>tbody"); //or better selector
              return Array.prototype.map.call(table_rows, function(tr) {
                var obj = {};
                var dataArray = [];
                for(var i =2; i <= tr.children.length; i++){
                    obj = {
                    "FILE NUMBER": tr.querySelector('tr:nth-child('+i+')>td:nth-child(1)').textContent.trim(),
                    "ENTITY NAME":tr.querySelector('tr:nth-child('+i+')>td:nth-child(2)').textContent.trim(),
                    "link":tr.querySelector('tr:nth-child('+i+')>td:nth-child(2)>a').getAttribute('id')
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
  console.log('beginning State of Delaware scraping process...');

    console.log(req.query);

  if ((req.query.host).indexOf("delaware") !== -1) {

    var domainLink = "https://icis.corp.delaware.gov/Ecorp/EntitySearch/NameSearch.aspx"; // Link to be scrap

    const keywordName = req.query.keyword; // Key parameter to pass
    const linkVal = req.query.link; // link paramete to get the selected value data
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
          this.emit('message', 'looking for General Informartion of Delaware with name ' + keyword);

          this.thenEvaluate(function(term) {
            document.querySelector('input#ctl00_ContentPlaceHolder1_frmEntityName').setAttribute('value', term);
            document.querySelector('input#ctl00_ContentPlaceHolder1_btnSubmit').click(); // Submit form event
          }, keyword);
        }
      ]);

      spooky.waitFor(function() {

        // Capture image to see if scrapped output is perfect or not
        // this.captureSelector('check.png', 'table#tblResults>tbody>tr:nth-child(2)>td:nth-child(2)>a');
        return (this.exists('table#tblResults'));
      }, function() {
        // then
      }, function() {
        // timeout
        this.emit('message', 'Timeout occurred');
      }, 3000);

      spooky.then([
        { link: linkVal },
        function() {

          this.emit('message', 'looking for General Informartion of Delaware with name ' + link);
          this.thenEvaluate(function(term) {
              __doPostBack('ctl00$ContentPlaceHolder1$rptSearchResults$ctl00$lnkbtnEntityName','');
          }, link);
        }
      ]);



      spooky.waitFor(function() {

        // Capture image to see if scrapped output is perfect or not
        this.captureSelector('finalcheck.png','table#TableBody');
        // this.capture('finalcheck12.png');
        return (this.exists('table#TableBody'));
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
          if (this.exists('table#TableBody')) {
            var info = this.evaluate(function(domainLink) {
              var table_rows = document.querySelectorAll("table#TableBody>tbody>tr:nth-child(2)>td:nth-child(2)>table:nth-child(4)>tbody"); //or better selector
              return Array.prototype.map.call(table_rows, function(tr) {
                return {
                 file_number: tr.querySelector('tr:nth-child(2)>td:nth-child(2)').textContent.trim(),
                 incorpDate:  tr.querySelector('tr:nth-child(2)>td:nth-child(4)').textContent.trim(),
                 entityName:  tr.querySelector('tr:nth-child(3)>td:nth-child(2)').textContent.trim(),
                 entityKind:  tr.querySelector('tr:nth-child(4)>td:nth-child(2)').textContent.trim(),
                 entityType:  tr.querySelector('tr:nth-child(4)>td:nth-child(4)').textContent.trim(),
                 residency:   tr.querySelector('tr:nth-child(5)>td:nth-child(2)').textContent.trim(),
                 State:       tr.querySelector('tr:nth-child(5)>td:nth-child(4)').textContent.trim(),
                 agentName:   tr.querySelector('tr:nth-child(9)>td:nth-child(2)').textContent.trim(),
                 agentAdd:    tr.querySelector('tr:nth-child(10)>td:nth-child(2)').textContent.trim(),
                 city:        tr.querySelector('tr:nth-child(11)>td:nth-child(2)').textContent.trim(),
                 country:     tr.querySelector('tr:nth-child(11)>td:nth-child(4)').textContent.trim(),
                 state:       tr.querySelector('tr:nth-child(12)>td:nth-child(2)').textContent.trim(),
                 postal_code: tr.querySelector('tr:nth-child(12)>td:nth-child(4)').textContent.trim(),
                 phone:       tr.querySelector('tr:nth-child(13)>td:nth-child(2)').textContent.trim()
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




export default {
  scrapeData: scrapeData,
  scrapeDetails: scrapeDetails
};
