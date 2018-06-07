var Spooky = require('spooky');
var _ = require('lodash');

async function scrapeData(req, res, next) {
    console.log('beginning alaska scraping process...');

    console.log(req.query);
    if ((req.query.host).indexOf("alaska") !== -1) {
        var domainLink = "https://www.commerce.alaska.gov/cbp/main/search/entities";
        const keywordName = req.query.keyword;
        const searchType = req.query.type || '';
        const searchFilter = req.query.filter || '';
        const checkboxFil = req.query.checkfil || '';

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
                { keyword: keywordName, searchType: searchType, searchFilter: searchFilter, checkboxFil: checkboxFil},
                function () {
                    this.emit('message', 'looking Corporation with ' + keyword);

                    this.thenEvaluate(function(term, filter, type ,checkfil) {
                      if (['CurrentOnly'].indexOf(checkfil) != -1) {
                        document.querySelector('input[type=checkbox][id=' + checkfil + ']').setAttribute('checked', true);
                      }
                      if (['IsStartsWithSearch'].indexOf(filter) != -1) {
                        document.querySelector('input[type=radio][id=' + filter + ']').setAttribute('checked', true);
                      }
                      if (type == 'id') {
                        document.querySelector('input#EntityNumber').setAttribute('value', term);
                      } else {
                        document.querySelector('input#EntityName').setAttribute('value', term);
                      }
                      document.querySelector("input.dccedBtn").click();
                    }, keyword, searchFilter, searchType, checkboxFil);
                }
            ]);

            spooky.waitFor(function() {

                this.captureSelector('alaska.png','form>div');
                //  this.emit('message', 'loading...');
                return (this.exists('form>div'));
            }, function() {
                // then
                // this.emit('message', 'wait over');
            }, function() {
                // timeout
                this.emit('message', 'Timeout occurred');
            }, 10000);

            spooky.then([
                { domainLink: domainLink },
                function() {
                    //do some casper js stuff
                    if (this.exists('form>div')) {
                        var info = this.evaluate(function(domainLink) {
                            var table_rows = document.querySelectorAll("form>div>table>tbody"); //or better selector
                            return Array.prototype.map.call(table_rows, function(tr) {
                                var obj = {};
                                var dataArray = [];
                                for(var i =1; i <= tr.children.length; i++){
                                    obj = {
                                    "entity_type": tr.querySelector('tr:nth-child('+i+')>td:nth-child(1)').textContent.trim(),
                                    "entity":      tr.querySelector('tr:nth-child('+i+')>td:nth-child(2)').textContent.trim(),
                                    "link":        "https://www.commerce.alaska.gov" + tr.querySelector('tr:nth-child('+i+')>td:nth-child(2)>a').getAttribute('href'),
                                    "entity_name": tr.querySelector('tr:nth-child('+i+')>td:nth-child(3)').textContent.trim(),
                                    "name_type":   tr.querySelector('tr:nth-child('+i+')>td:nth-child(4)').textContent.trim(),
                                    "status":      tr.querySelector('tr:nth-child('+i+')>td:nth-child(5)').textContent.trim()
                                    };
                                    dataArray.push(obj);
                                }
                                return {
                                    dataArray
                                }
                            });
                        }, domainLink);
                        // this.emit('message', info);
                        if (info) {
                            this.emit('finalResult', info);
                        } else {
                            this.emit('noResult', 'No data available');
                        }
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
            result = _.take(result, 10);
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

        // res.json({ message: "businessSearch scrape" });

    } else {
        res.json({ message: "Host name mismatch" });
    }

};



// ============Captcha Code Issue==============

// async function scrapeDetails(req, res, next) {
//     console.log('beginning alaska detail scraping process...');

//     console.log(req.query);
//     if ((req.query.host).indexOf("alaska") !== -1) {

//         const link = req.query.link;
//         const domainLink = "https://www.commerce.alaska.gov/cbp/main/search/entities";
//         const dataLink = "https://www.commerce.alaska.gov/CBP/Main/Search/EntityDetail/57162D";

//         console.log(dataLink,"final link");

//         var spooky = new Spooky({
//             child: {
//                 transport: 'http'
//             },
//             casper: {
//                 logLevel: 'debug',
//                 verbose: true
//             }
//         }, function (err) {
//             if (err) {
//                 e = new Error('Failed to initialize SpookyJS');
//                 e.details = err;
//                 throw e;
//             }

//             spooky.start(dataLink,function(){
//                 this.capture('demo.png');
//             });

//             spooky.waitFor(function() {
//                 this.capture('alaska1.png');
//                 //  this.emit('message', 'loading...');
//                 return (this.exists('.s-holder .panel'));
//             }, function() {
//                 // then

//             }, function() {
//                 // timeout
//                 this.emit('message', 'Timeout occurred');
//             }, 3000);

//             spooky.then([
//                 { dataLink: dataLink },
//                 function () {
//                     this.emit('message', 'looking details for ' + dataLink);

//                     if (this.exists('form>div')) {
//                         var info = this.evaluate(function(dataLink) {
//                             var table_rows = document.querySelectorAll("form>div>table>tbody"); //or better selector
//                             return Array.prototype.map.call(table_rows, function(tr) {
//                                 var obj = {};
//                                 var dataArray = [];
//                                 for(var i =1; i <= tr.children.length; i++){
//                                     obj = {
//                                     "entity_type": tr.querySelector('tr:nth-child('+i+')>td:nth-child(1)').textContent.trim(),
//                                     "entity":      tr.querySelector('tr:nth-child('+i+')>td:nth-child(2)').textContent.trim(),
//                                     "link":        "https://www.commerce.alaska.gov" + tr.querySelector('tr:nth-child('+i+')>td:nth-child(2)>a').getAttribute('href'),
//                                     "entity_name": tr.querySelector('tr:nth-child('+i+')>td:nth-child(3)').textContent.trim(),
//                                     "name_type":   tr.querySelector('tr:nth-child('+i+')>td:nth-child(4)').textContent.trim(),
//                                     "status":      tr.querySelector('tr:nth-child('+i+')>td:nth-child(5)').textContent.trim()
//                                     };
//                                     dataArray.push(obj);
//                                 }
//                                 return {
//                                     dataArray
//                                 }
//                             });
//                         }, dataLink);
//                         // this.emit('message', info);
//                         if (info) {
//                             this.emit('finalResult', info);
//                         } else {
//                             this.emit('noResult', 'No data available');
//                         }
//                     } else {
//                         this.emit('noResult', 'No data available');
//                     }
//                 }
//             ]);

//             spooky.run();
//         });

//         spooky.on('error', function (e, stack) {
//             console.error("Error", e);

//             if (stack) {
//                 console.log("stack", stack);
//             }
//             res.json({ error: e });
//         });

//         spooky.on('message', function (greeting) {
//             console.log(greeting);
//         });

//         spooky.on('finalResult', function(result) {
//             result = _.filter(result, function(item) {
//                 item.details = _.compact(item.details);
//                 item.details = _.reduce(item.details, function(memo, current) { return _.assign(memo, current) },  {});
//                 return item;
//             });
//             result = _.compact(result);
//             result = _.reduce(result, function(memo, current) { return _.assign(memo, current) },  {});
//             res.json({ data: result });
//         });

//         spooky.on('noResult', function(result) {
//             res.json({ message: result });
//         });

//         spooky.on('log', function (log) {
//             if (log.space === 'remote') {
//                 console.log(log.message.replace(/ \- .*/, ''));
//             }
//         });
//     } else {
//         res.json({ message: "Host name mismatch" });
//     }
// };

// ============================================

export default {
    scrapeData: scrapeData
    // scrapeDetails: scrapeDetails
};
