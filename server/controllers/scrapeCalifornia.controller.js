var Spooky = require('spooky');
var _ = require('lodash');

async function scrapeData(req, res, next) {
    console.log('beginning California scraping process...');

    console.log(req.query);
    if ((req.query.host).indexOf("businesssearch") !== -1) {
        var domainLink = "https://businesssearch.sos.ca.gov/";
        const keywordName = req.query.keyword;
        const searchType = req.query.type || ''; // CORP,LPLLC,NUMBER

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
            spooky.then([{
                    keyword: keywordName,
                    searchType: searchType
                },
                function() {
                    this.emit('message', 'looking Corporation with name ' + keyword);
                    this.thenEvaluate(function(term, type) {
                        if (['CORP', 'LPLLC', 'NUMBER'].indexOf(type) != -1) {
                            document.querySelector('input[name=SearchType][value=' + type + ']').setAttribute('checked', true);
                        }
                        document.querySelector('input#SearchCriteria').setAttribute('value', term);
                        document.querySelector('form#formSearch').submit();
                    }, keyword, searchType);
                }
            ]);
            spooky.waitFor(function() {
                //  this.emit('message', 'loading...');
                return (this.exists('#enitityTable'));
            }, function() {
                // then
                // this.emit('message', 'wait over');
            }, function() {
                // timeout
                this.emit('message', 'Timeout occurred');
            }, 5000);

            spooky.then([{
                    domainLink: domainLink
                },
                function() {
                    //do some casper js stuff
                    if (this.exists('#enitityTable')) {
                        var info = this.evaluate(function(domainLink) {
                            var table_rows = document.querySelectorAll("#enitityTable tbody tr"); //or better selector
                            return Array.prototype.map.call(table_rows, function(tr) {
                                return {
                                    entityNumber: tr.querySelector("td:nth-child(1)").textContent.trim(),
                                    registrationDate: tr.querySelector("td:nth-child(2)").textContent.trim(),
                                    status: tr.querySelector("td:nth-child(3)").textContent.trim(),
                                    entityName: tr.querySelector("td:nth-child(4) .btn-link").textContent.trim(),
                                    entityId: tr.querySelector("td button[name=EntityId]").getAttribute('value'),
                                    jurisdiction: tr.querySelector("td:nth-child(5)").textContent.trim(),
                                    agentForService: tr.querySelector("td:nth-child(6)").textContent.trim()
                                };
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

        spooky.on('error', function(e, stack) {
            console.error("Error", e);

            if (stack) {
                console.log("stack", stack);
            }
            res.json({
                error: e
            });
        });

        spooky.on('message', function(greeting) {
            console.log(greeting);
        });

        spooky.on('finalResult', function(result) {
            result = _.take(result, 10);
            res.json({
                data: result
            });
        });

        spooky.on('noResult', function(result) {
            res.json({
                message: result
            });
        });

        spooky.on('log', function(log) {
            if (log.space === 'remote') {
                console.log(log.message.replace(/ \- .*/, ''));
            }
        });

        // res.json({ message: "businessSearch scrape" });

    } else {
        res.json({
            message: "Host name mismatch"
        });
    }

};


async function scrapeDetails(req, res, next) {
    console.log('beginning California detail scraping process...');

    console.log(req.query);
    if ((req.query.number) && (req.query.host).indexOf("businesssearch") !== -1) {
        var domainLink = "https://businesssearch.sos.ca.gov/";
        const entityNumber = req.query.number;

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

            spooky.then([{
                    number: entityNumber
                },
                function() {
                    this.emit('message', 'looking entity number ' + number);

                    this.thenEvaluate(function(term) {
                        document.querySelector('input[name=SearchType][value=NUMBER]').setAttribute('checked', true);
                        document.querySelector('input#SearchCriteria').setAttribute('value', term);
                        document.querySelector('form#formSearch').submit();
                    }, number);
                }
            ]);

            spooky.waitFor(function() {
                //  this.emit('message', 'loading...');
                // this.capture('california.png');
                return (this.exists('#enitityTable'));
            }, function() {
                // then
                this.thenEvaluate(function() {
                    document.querySelector(".btn-link.EntityLink").click();
                });
            }, function() {
                // timeout
                this.emit('message', 'Timeout occurred');
            }, 5000);

            spooky.waitFor(function() {
                //  this.emit('message', 'loading...');
                // this.captureSelector('califor.png', 'div#maincontent>div:nth-child(12)>div>form#formDetails>div>table>tbody');
                return (this.exists('div#maincontent'));
            }, function() {
                // then

            }, function() {
                // timeout
                this.emit('message', 'Timeout occurred');
            }, 3000);

            spooky.then([{
                    number: entityNumber
                },
                function() {
                    this.emit('message', 'looking business details for ' + number);

                    if (this.exists('div#maincontent')) {
                        var info = this.evaluate(function() {
                            var details_row = document.querySelectorAll("div#maincontent");

                            return Array.prototype.map.call(details_row, function(tr) {
                                var corp_rows = tr.querySelectorAll("div:nth-child(12)>div>form#formDetails>div>table>tbody");
                                var table_rows1 = Array.prototype.map.call(corp_rows, function(tr) {
                                    var dataArray = [];
                                    for (var i = 1; i <= tr.children.length; i++) {
                                        var obj = {
                                            "documentType": tr.querySelector('tr:nth-child(' + i + ')>td:nth-child(1)').textContent.replace(/\s\s+/g, ''),
                                            "fileDate": tr.querySelector('tr:nth-child(' + i + ')>td:nth-child(2)').textContent.replace(/\s\s+/g, ''),
                                            "pdf": tr.querySelector('tr:nth-child(' + i + ')>td:nth-child(3)').textContent.replace(/\s\s+/g, '')
                                        };
                                        dataArray.push(obj);

                                    }
                                    return dataArray;
                                });

                                return {
                                    document_Detail: table_rows1,
                                    registration_Date: tr.querySelector('div:nth-child(4)>div:nth-child(2)').textContent.replace(/\s\s+/g, ''),
                                    jurisdiction: tr.querySelector('div:nth-child(5)>div:nth-child(2)').textContent.replace(/\s\s+/g, ''),
                                    entity_Type: tr.querySelector('div:nth-child(6)>div:nth-child(2)').textContent.replace(/\s\s+/g, ''),
                                    status: tr.querySelector('div:nth-child(7)>div:nth-child(2)').textContent.replace(/\s\s+/g, ''),
                                    agent_For_Service: tr.querySelector('div:nth-child(8)>div:nth-child(2)').textContent.replace(/\s\s+/g, ''),
                                    entity_Address: tr.querySelector('div:nth-child(9)>div:nth-child(2)').textContent.replace(/\s\s+/g, ''),
                                    entity_Mailing_Add: tr.querySelector('div:nth-child(10)>div:nth-child(2)').textContent.replace(/\s\s+/g, '')


                                };
                            });
                        });
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

        spooky.on('error', function(e, stack) {
            console.error("Error", e);

            if (stack) {
                console.log("stack", stack);
            }
            res.json({
                error: e
            });
        });

        spooky.on('message', function(greeting) {
            console.log(greeting);
        });

        spooky.on('finalResult', function(result) {
            result = _.compact(result);
            result = _.reduce(result, function(memo, current) {
                return _.assign(memo, current)
            }, {});
            res.json({
                data: result
            });
        });

        spooky.on('noResult', function(result) {
            res.json({
                message: result
            });
        });

        spooky.on('log', function(log) {
            if (log.space === 'remote') {
                console.log(log.message.replace(/ \- .*/, ''));
            }
        });
    } else {
        res.json({
            message: "Host name mismatch"
        });
    }
};

export default {
    scrapeData: scrapeData,
    scrapeDetails: scrapeDetails
};