var Spooky = require('spooky');
var _ = require('lodash');

async function scrapeData(req, res, next) {
    console.log('beginning Utah scraping process...');

    console.log(req.query);

    if ((req.query.host).indexOf("utah") !== -1) {

        var domainLink = "https://secure.utah.gov/bes/"; // Link to be scrap

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
            spooky.start(domainLink, function() {
                this.capture('asd.png');
            });
            spooky.then([{
                    keyword: keywordName
                },
                function() {
                    this.emit('message', 'looking for General Informartion of Utah with name ' + keyword);

                    this.thenEvaluate(function(term) {
                        document.querySelector('input#name').setAttribute('value', term);
                        document.getElementById('index.searchByName').click(); // Submit form event
                    }, keyword);
                }
            ]);

            spooky.waitFor(function() {

                // Capture image to see if scrapped output is perfect or not
                this.captureSelector('test.png', 'form#searchFO > div.entities');
                //this.capture('test.png');
                return (this.exists('form#searchFO > div.entities > div.entityRow'));
            }, function() {
                // then
            }, function() {
                // timeout
                this.emit('message', 'Timeout occurred');
            }, 3000);

            spooky.then([{
                    domainLink: domainLink
                },
                function() {
                    //do some casper js stuff
                    if (this.exists('form#searchFO > div.entities > div.entityRow')) {
                        var info = this.evaluate(function(domainLink) {
                            var table_rows = document.querySelectorAll("div#main>form>div.entities"); //or better selector
                            return Array.prototype.map.call(table_rows, function(tr) {
                                var obj = {};
                                var dataArray = [];
                                for (var i = 2; i <= tr.children.length; i++) {
                                    obj = {

                                        "Name": tr.querySelector('div:nth-child(' + i + ')>div:nth-child(1)').textContent.trim(),
                                        "Link": "https://secure.utah.gov" + tr.querySelector('div:nth-child(' + i + ')>div:nth-child(1) > a').getAttribute('href'),
                                        "Status": tr.querySelector('div:nth-child(' + i + ')>div:nth-child(2)>div:nth-child(1)').textContent.trim(),
                                        "Type": tr.querySelector('div:nth-child(' + i + ')>div:nth-child(2)>div:nth-child(2)').textContent.trim(),
                                        "City": tr.querySelector('div:nth-child(' + i + ')>div:nth-child(2)>div:nth-child(3)').textContent.trim()
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
    }
};




async function scrapeDetails(req, res, next) {
    console.log('beginning Utah detail scraping process...');

    console.log(req.query.link);
    if ((req.query.link) && (req.query.link).indexOf("utah") !== -1) {
        const link = req.query.link;

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

            spooky.start(link);

            spooky.waitFor(function() {
                this.captureSelector('utah.png', 'form#businessDetailsFO');
                //  this.emit('message', 'loading...');
                return (this.exists('form#businessDetailsFO'));
            }, function() {
                // then

            }, function() {
                // timeout
                this.emit('message', 'Timeout occurred');
            }, 3000);

            spooky.then([{
                    link: link
                },
                function() {
                    this.emit('message', 'looking companies details for ' + link);

                    if (this.exists('form#businessDetailsFO')) {
                        var info = this.evaluate(function() {
                            var tables = document.querySelectorAll("form#businessDetailsFO");
                            // return [{count: tables.length}, {tables: tables.innerHTML}];
                            return Array.prototype.map.call(tables, function(table) {
                                // return table.innerHTML;

                                var table_rows1 = table.querySelectorAll('p:nth-child(1)');
                                var rows1 = Array.prototype.map.call(table_rows1, function(tbr1) {
                                    var tes_obj = {
                                        "entity_Number": tbr1.querySelector('b:nth-child(1)').nextSibling.textContent.replace(/\s\s+/g, ""),
                                        "company_Type": tbr1.querySelector('b:nth-child(3)').nextSibling.textContent.replace(/\s\s+/g, ""),
                                        "address": tbr1.querySelector('b:nth-child(5)').nextSibling.textContent.replace(/\s\s+/g, ""),
                                        "state_Origin": tbr1.querySelector('b:nth-child(7)').nextSibling.textContent.replace(/\s\s+/g, ""),
                                        "registered_agent": tbr1.querySelector('a:nth-child(10)').textContent.replace(/\s\s+/g, "")
                                    }
                                    return tes_obj;
                                });


                                var table_rows2 = table.querySelectorAll('p:nth-child(4)');
                                if (table.querySelector('h4:nth-child(2)').textContent == "Status: Expired") {
                                    table_rows2 = table.querySelectorAll('p:nth-child(3)');
                                }
                                var rows2 = Array.prototype.map.call(table_rows2, function(tbr1) {
                                    var tes_obj1 = {
                                        "status": tbr1.querySelector('b:nth-child(1)').nextSibling.textContent.replace(/\s\s+/g, ""),
                                        "status_as_of": tbr1.querySelector('em').textContent.replace(/\s\s+/g, ""),
                                        "renew_by": tbr1.querySelector('b:nth-child(5)').nextSibling.textContent.replace(/\s\s+/g, ""),
                                        "status_description": tbr1.querySelector('b:nth-child(7)').nextSibling.textContent.replace(/\s\s+/g, ""),
                                        "employement_verifi.": tbr1.querySelector('u').textContent.replace(/\s\s+/g, "") + tbr1.querySelector('u').nextSibling.textContent.replace(/\s\s+/g, "") + tbr1.querySelector('a').textContent.replace(/\s\s+/g, "")
                                    }
                                    return tes_obj1;
                                });


                                var table_rows3 = table.querySelectorAll('p:nth-child(7)');
                                if (table.querySelector('h4:nth-child(2)').textContent == "Status: Expired") {
                                    table_rows3 = table.querySelectorAll('p:nth-child(6)');
                                }
                                var rows3 = Array.prototype.map.call(table_rows3, function(tbr1) {
                                    var tes_obj2 = {
                                        "registration_date": tbr1.querySelector('b:nth-child(1)').nextSibling.textContent.replace(/\s\s+/g, ""),
                                        "last_renewed": tbr1.querySelector('b:nth-child(3)').nextSibling.textContent.replace(/\s\s+/g, "")
                                    }
                                    return tes_obj2;
                                });


                                return {
                                    agent_Detail: rows1,
                                    Status: rows2,
                                    History: rows3
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
            result = _.filter(result, function(item) {
                item.details = _.compact(item.details);
                item.details = _.reduce(item.details, function(memo, current) {
                    return _.assign(memo, current)
                }, {});
                return item;
            });
            result = _.compact(result);
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