var Spooky = require('spooky');
var _ = require('lodash');

async function scrapeData(req, res, next) {
    console.log('beginning wyobiz scraping process...');

    console.log(req.query);
    if ((req.query.host).indexOf("wyobiz") !== -1) {
        var domainLink = "https://wyobiz.wy.gov/business/";
        const keywordName = req.query.keyword;
        const searchType = req.query.type || '';
        const searchFilter = req.query.filter || '';

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

            spooky.start(domainLink + 'filingsearch.aspx');
            spooky.then([
                { keyword: keywordName, searchType: searchType, searchFilter: searchFilter },
                function () {
                    this.emit('message', 'looking Corporation with ' + keyword);

                    this.thenEvaluate(function(term, type, filter) {
                      if (['chkSearchStartWith', 'chkSearchIncludes'].indexOf(filter) != -1) {
                        document.querySelector('input[type=radio][value=' + filter + ']').setAttribute('checked', true);
                      }
                      if (type == 'id') {
                        document.querySelector('input#MainContent_txtFilingID').setAttribute('value', term);
                      } else {
                        document.querySelector('input#MainContent_txtFilingName').setAttribute('value', term);
                      }
                      document.getElementById("MainContent_cmdSearch").click();
                    }, keyword, searchType, searchFilter);
                }
            ]);

            spooky.waitFor(function() {
                //  this.emit('message', 'loading...');
                return (this.exists('#Ol1.search-results'));
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
                    if (this.exists('#Ol1.search-results')) {
                        var info = this.evaluate(function(domainLink) {
                            var table_rows = document.querySelectorAll("#Ol1.search-results li"); //or better selector
                            return Array.prototype.map.call(table_rows, function(tr) {
                                var returnObj = {
                                    name: tr.querySelector("span.resFile1").textContent.trim(),
                                    link: domainLink + tr.querySelector("a").getAttribute('href')
                                };
                                var allLabels = tr.querySelectorAll("span .resultField");
                                if (allLabels.length != 0) {
                                  Array.prototype.map.call(allLabels, function(label) {
                                    label.remove();
                                  });
                                }
                                returnObj["status"] = tr.querySelector("span.resFile2").textContent.trim();
                                returnObj["standingTax"] = tr.querySelector("span.resFile3").textContent.trim();
                                returnObj["standingGood"] = tr.querySelector("span.resFile4").textContent.trim();
                                returnObj["filedOn"] = tr.querySelector("span.resFile5").textContent.trim();

                                return returnObj;
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


async function scrapeDetails(req, res, next) {
    console.log('beginning wyobiz detail scraping process...');

    console.log(req.query);
    if ((req.query.link) && (req.query.link).indexOf("wyobiz") !== -1) {
        var domainLink = "https://wyobiz.wy.gov/business/";
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
                return (this.exists('.s-holder .panel'));
            }, function() {
                // then

            }, function() {
                // timeout
                this.emit('message', 'Timeout occurred');
            }, 3000);

            spooky.then([
                { link: link },
                function () {
                    this.emit('message', 'looking details for ' + link);

                    if (this.exists('.s-holder .panel')) {
                        var info = this.evaluate(function() {
                            var detailObj = {};
                            detailObj["heading"] = document.querySelector(".panel-heading #txtFilingName").textContent;
                            detailObj["infotext"] = document.querySelector(".formInfo .InfoText").textContent;

                            var details_row = document.querySelectorAll(".s-holder .panel-body .row-fluid");
                            var detailData = Array.prototype.map.call(details_row, function(tr) {
                                var returnObj = {};
                                // if (tr.querySelector('.fieldLabel')) {
                                //     returnObj[tr.querySelector('.fieldLabel').textContent] = tr.querySelector('.fieldLabel + .fieldData').textContent;
                                // }
                                // var field_row = tr.querySelectorAll(".fieldLabel");
                                // Array.prototype.map.call(field_row, function(field, index) {
                                //     returnObj[field.textContent] = '';
                                //     if (field) {
                                //         returnObj[field.textContent] = field.innerHTML;
                                //     }
                                // });
                                if (tr.querySelector('#lblName')) { returnObj[tr.querySelector('#lblName').textContent.trim()] = ''; }
                                if (tr.querySelector('#txtFilingName2')) { returnObj[tr.querySelector('#lblName').textContent.trim()] = tr.querySelector('#txtFilingName2').textContent.trim(); }

                                if (tr.querySelector('#txtFilingNum')) { returnObj["Filing ID"] = tr.querySelector('#txtFilingNum').textContent.trim(); }

                                if (tr.querySelector('#lblFilingType')) { returnObj[tr.querySelector('#lblFilingType').textContent.trim()] = ''; }
                                if (tr.querySelector('#txtFilingType')) { returnObj[tr.querySelector('#lblFilingType').textContent.trim()] = tr.querySelector('#txtFilingType').textContent.trim(); }

                                if (tr.querySelector('#txtStatus')) { returnObj["Status"] = tr.querySelector('#txtStatus').textContent.trim(); }
                                if (tr.querySelector('#txtSubStatus')) { returnObj["Sub Status"] = tr.querySelector('#txtSubStatus').textContent.trim(); }

                                if (tr.querySelector('#txtInitialDate')) { returnObj["Initial Filing"] = tr.querySelector('#txtInitialDate').textContent.trim(); }
                                if (tr.querySelector('#txtEffectiveDate')) { returnObj["Effective Filing"] = tr.querySelector('#txtEffectiveDate').textContent.trim(); }

                                if (tr.querySelector('#txtStandingRA')) { returnObj["Standing - RA"] = tr.querySelector('#txtStandingRA').textContent.trim(); }
                                if (tr.querySelector('#txtStandingOther')) { returnObj["Standing - Other"] = tr.querySelector('#txtStandingOther').textContent.trim(); }

                                if (tr.querySelector('#txtInactiveDate')) { returnObj["Inactive Date"] = tr.querySelector('#txtInactiveDate').textContent.trim(); }
                                if (tr.querySelector('#txtDuration')) { returnObj["Term of Duration"] = tr.querySelector('#txtDuration').textContent.trim(); }

                                if (tr.querySelector('#txtFormation')) { returnObj["Formed In"] = tr.querySelector('#txtFormation').textContent.trim(); }
                                if (tr.querySelector('#txtPurposeCode')) { returnObj["Purpose Code"] = tr.querySelector('#txtPurposeCode').textContent.trim(); }

                                if (tr.querySelector('#txtFictitiousName')) { returnObj["Fictitious Name"] = tr.querySelector('#txtFictitiousName').textContent.trim(); }

                                if (tr.querySelector('#txtOfficeAddresss')) { returnObj["Principal Office"] = tr.querySelector('#txtOfficeAddresss').textContent.trim(); }
                                if (tr.querySelector('#txtMailAddress')) { returnObj["Mailing Address"] = tr.querySelector('#txtMailAddress').textContent.trim(); }

                                return returnObj;
                            });

                            detailObj["details"] = detailData;

                            return [detailObj];
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
            result = _.reduce(result, function(memo, current) { return _.assign(memo, current) },  {});
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
