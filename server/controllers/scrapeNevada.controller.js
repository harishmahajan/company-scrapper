var Spooky = require('spooky');
var _ = require('lodash');

async function scrapeData(req, res, next) {
    console.log('beginning nevada scraping process...');

    console.log(req.query);
    if ((req.query.host).indexOf("nvsos") !== -1) {
        var domainLink = "http://nvsos.gov/sosentitysearch/";
        const keywordName = req.query.keyword;

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
                    this.emit('message', 'looking companies with name ' + keyword);

                    this.thenEvaluate(function(term) {
                       document.querySelector('#ctl00_MainContent_txtSearchBox').setAttribute('value', term);
                       document.getElementById("ctl00_MainContent_btnCorpSearch").click();
                    }, keyword);
                }
            ]);

            spooky.waitFor(function() {
                //  this.emit('message', 'loading...');
                return (this.exists('#ctl00_MainContent_objSearchGrid_dgCorpSearchResults'));
            }, function() {
                // then

            }, function() {
                // timeout
                this.emit('message', 'Timeout occurred');
            }, 8000);

            spooky.then([
                { domainLink: domainLink },
                function() {
                    //do some casper js stuff
                    if (this.exists('#ctl00_MainContent_objSearchGrid_dgCorpSearchResults')) {
                        var info = this.evaluate(function(domainLink) {
                            var table_rows = document.querySelectorAll("tbody tr.TDColorC"); //or better selector
                            return Array.prototype.map.call(table_rows, function(tr) {
                                return {
                                    name: tr.querySelector("td a").textContent,
                                    link: domainLink + tr.querySelector("td a").getAttribute('href'),
                                    NVid: tr.querySelector("td:nth-child(2)").textContent,
                                    status: tr.querySelector("td:nth-child(3)").textContent,
                                    type: tr.querySelector("td:nth-child(4)").textContent
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

        // res.json({ message: "nevada scrape" });

    } else {
        res.json({ message: "Host name mismatch" });
    }

};


async function scrapeDetails(req, res, next) {
    console.log('beginning nevada detail scraping process...');

    console.log(req.query.link);
    if ((req.query.link) && (req.query.link).indexOf("nvsos") !== -1) {
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
                return (this.exists('.SOSContent table.entrybox'));
            }, function() {
                // then

            }, function() {
                // timeout
                this.emit('message', 'Timeout occurred');
            }, 3000);

            spooky.then([
                { link: link },
                function () {
                    this.emit('message', 'looking companies details for ' + link);

                    if (this.exists('.SOSContent')) {
                        var info = this.evaluate(function() {
                            var tables = document.querySelectorAll("table.entrybox");
                            // return [{count: tables.length}, {tables: tables.innerHTML}];
                            return Array.prototype.map.call(tables, function(table) {
                                // return table.innerHTML;
                                var title = table.querySelector(".HeaderBarLeft tr td b").textContent;

                                var table_rows = table.querySelectorAll(".entryform tr");
                                if (table_rows.length == 0) {
                                  table_rows = table.querySelectorAll(".entryform27 tr");
                                }
                                var detailData = Array.prototype.map.call(table_rows, function(tr) {
                                    var returnObj = {};
                                    if (tr.children.length >= 1) {
                                        if (tr.children[0].textContent.trim().replace(':','')) {
                                            returnObj[tr.children[0].textContent.trim().replace(':','')] = '';
                                        }
                                    }
                                    if (tr.children.length >= 2) {
                                        if (tr.children[0].textContent.trim().replace(':','')) {
                                            returnObj[tr.children[0].textContent.trim().replace(':','')] = tr.children[1].textContent.trim();
                                        }
                                    }
                                    if (tr.children.length >= 3) {
                                        if (tr.children[2].textContent.trim().replace(':','')) {
                                            returnObj[tr.children[2].textContent.trim().replace(':','')] = '';
                                        }
                                    }
                                    if (tr.children.length >= 4) {
                                        if (tr.children[2].textContent.trim().replace(':','')) {
                                            returnObj[tr.children[2].textContent.trim().replace(':','')] = tr.children[3].textContent.trim();
                                        }
                                    }
                                    return returnObj;
                                });

                                return {
                                    title: title,
                                    details: detailData
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
