var Spooky = require('spooky');
var _ = require('lodash');

async function scrapeData(req, res, next) {
  console.log('beginning South Dakota scraping process...');


  if ((req.query.host).indexOf("sosenterprise") !== -1) {
    var domainLink = "https://sosenterprise.sd.gov/BusinessServices/Business/FilingSearch.aspx";
    const keywordName = req.query.keyword;
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
          this.emit('message', 'looking Business with name ' + keyword);

          this.thenEvaluate(function(term) {
            document.querySelector('#ctl00_MainContent_txtSearchValue').setAttribute('value', term);
            __doPostBack('ctl00$MainContent$SearchButton','');
          }, keyword);
        }
      ]);


      spooky.waitFor(function() {
                //  this.emit('message', 'loading...');
                this.capture('one.png');
                this.captureSelector('check.png','#DataTables_Table_0>tbody')
                return (this.exists('#DataTables_Table_0>tbody'));
            }, function() {
                // then

            }, function() {
                // timeout
                this.emit('message', 'Timeout occurred');
            }, 10000);

            spooky.then([
                { domainLink: domainLink },
                function() {
                    //do some casper js stuff
                    if (this.exists('#DataTables_Table_0')) {
                        this.captureSelector('table.png','tbody>tr:nth-child(2)>td:nth-child(2)');
                        // this.captureSelector('table1.png','tbody>tr');
                        var info = this.evaluate(function(domainLink) {
                            var table_rows = document.querySelectorAll("#DataTables_Table_0>tbody"); //or better selector
                            return Array.prototype.map.call(table_rows, function(tr) {
                                var obj = {};
                                var dataArray = [];
                                for(var i =1; i <= tr.children.length; i++){
                                    obj = {
                                    "Name": tr.querySelector('tr:nth-child('+i+')>td:nth-child(3)').textContent,
                                    "SDid":tr.querySelector('tr:nth-child('+i+')>td:nth-child(1)').textContent,
                                    "link":"https://sosenterprise.sd.gov/BusinessServices/Business/" + tr.querySelector('tr:nth-child('+i+')>td a').getAttribute('href'), // Corporate Link
                                    "Status": tr.querySelector('tr:nth-child('+i+')>td:nth-child(7)').textContent,
                                    "Type": tr.querySelector('tr:nth-child('+i+')>td:nth-child(2)').textContent,
                                    "Name_type": tr.querySelector('tr:nth-child('+i+')>td:nth-child(4)').textContent,
                                    "Name_status": tr.querySelector('tr:nth-child('+i+')>td:nth-child(5)').textContent,
                                    "Filling_date": tr.querySelector('tr:nth-child('+i+')>td:nth-child(6)').textContent
                                    };
                                    dataArray.push(obj);

                                }
                                return dataArray;
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
    console.log('beginning South Dakota detail scraping process...');

    console.log(req.query.link);
    if ((req.query.link) && (req.query.link).indexOf("sosenterprise") !== -1) {
        //var domainLink = "https://sosenterprise.sd.gov/BusinessServices/Business/FilingSearch.aspx";
        //const link = 'https://sosenterprise.sd.gov/BusinessServices/Business/FilingDetail.aspx?CN=241156232022243166140089173209018236216209076085';
        const link = req.query.link;

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

            spooky.start(link);

            spooky.waitFor(function() {
                //  this.emit('message', 'loading...');
                return (this.exists('div#container'));
            }, function() {
                // then

            }, function() {
                // timeout
                this.emit('message', 'Timeout occurred');
            }, 3000);

            spooky.then([
                { link: link },
                function () {
                    this.emit('message', 'looking Business details for ' + link);
                    if (this.exists('div#container')) {
                        // this.captureSelector('output.png','div:nth-child(2)>div.form-group>div.row>div#ctl00_MainContent_divHistorySummary>table>tbody:nth-child(3)>tr>td:nth-child(1)');
                        var info = this.evaluate(function() {
                            var tables = document.querySelectorAll("div#ctl00_MainContent_updatePanel");
                            return Array.prototype.map.call(tables, function(table) {
                                Title = table.querySelector("div.HeaderDivisionPage").textContent;
                                var corp_rows = table.querySelectorAll("div:nth-child(2)>div.taller");
                                var table_rows1 = Array.prototype.map.call(corp_rows, function(tr) {
                                    var tes_obj = {};
                                    tes_obj[tr.children[1].textContent] = (tr.children[2].textContent).replace(/(\n)/g,"");
                                    return tes_obj;
                                });

                                var agent_rows = table.querySelectorAll("div:nth-child(2)>div.form-group>div.taller");
                                var table_rows2 = Array.prototype.map.call(agent_rows, function(tr) {
                                    var tes_obj2 = {};
                                    tes_obj2[tr.children[1].textContent] = (tr.children[2].textContent).replace(/(\n)/g,"");
                                    return tes_obj2;
                                });

                                var history_rows = table.querySelectorAll("div:nth-child(2)>div.form-group>div.row>div#ctl00_MainContent_divHistorySummary>table");
                                var table_rows3 = Array.prototype.map.call(history_rows, function(tr) {
                                    var history_arr = [];
                                    for(var i = 2; i <= tr.children.length; i++){
                                    var tes_obj3 = {
                                        "type": tr.querySelector('tbody:nth-child('+i+')>tr>td:nth-child(1)').textContent,
                                        "file_date": tr.querySelector('tbody:nth-child('+i+')>tr>td:nth-child(2)').textContent,
                                        "view_document_link": tr.querySelector('tbody:nth-child('+i+')>tr>td:nth-child(3)').textContent
                                    };
                                    history_arr.push(tes_obj3);
                                }
                                    return history_arr;
                                });
                                    // var mail_address;
                                    // if(table.querySelector("div:nth-child(2)>div:nth-child(9)>div:nth-child(6)").textContent != undefined){
                                    //     mail_address = (table.querySelector("div:nth-child(2)>div:nth-child(9)>div:nth-child(6)").textContent).replace(/(\n)/g,"");
                                    // }
                                    // else{

                                    //     mail_address = "no data available"
                                    // }
                                    
                                return {
                                    title: Title,
                                    corp_data: table_rows1,
                                    agent_data: table_rows2,
                                    history_data: table_rows3


                                };
                            });
                        });
                        // this.emit('message', info);

                        this.emit('finalResult', info);
                    } else {
                        this.emit('noResult', 'No data available');
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

        spooky.on('finalResult', function(result) {
            result = _.filter(result, function(item) {
                item.details = _.compact(item.details);
                item.details = _.reduce(item.details, function(memo, current) { return _.assign(memo, current) },  {});
                return item;
            });
            result = _.compact(result);
            res.json({ data: result });
        });

        spooky.on('noResult', function(result) {
            res.json({ message: result });
        });

        spooky.on('log', function (log) {
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