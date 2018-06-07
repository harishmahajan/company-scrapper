var Spooky = require('spooky');
var _ = require('lodash');

async function scrapeData(req, res, next) {
    console.log('beginning bsd.sos.in.gov scraping process...', req.body);

    if ((req.body.host).indexOf("nvsilverflume") !== -1) {
        var domainLink = "https://www.nvsilverflume.gov/account/login?service=https%3A%2F%2Fwww.nvsilverflume.gov%2Fj_spring_cas_security_check"; // Link to be scrap
        const emailId = req.body.email || ''; // Key parameter to pass
        const password = req.body.password || '';

        //=======Step 1=========
        var newNavadaBusiness = req.body.newbusiness || '';
        var newNavadaBusiness1 = req.body.newbusiness1 || '';
        //======================
        //=======Nevada Location=======
        var nevadaLocation = req.body.nevadalocation || '';
        //=============================

        //===========Sole Proprietorship===========
        // var soleFirstname = req.body.sfirstname || '';
        // var soleMiddlename = req.body.smiddlename || '';
        // var soleLastname = req.body.slastname || '';
        // var soleSpousefname = req.body.spousefname || '';
        // var soleSpousemname = req.body.spousemname || '';
        // var soleSpouselname = req.body.spouselname || '';
        // var spouseLicenseholder = req.body.slholder || '';
        // var soleAddress = req.body.soleaddress || '';
        // var soleCity = req.body.solecity || '';
        // var soleZipcode = req.body.zipcode || '';
        //======================================


        //==========General Partnership===========
        var gpTitle = req.body.gptitle || '';
        var gpFirstname = req.body.gpfname || '';
        var gpMiddlename = req.body.gpmname || '';
        var gpLastname = req.body.gplname || '';
        var partnershipName = req.body.pname || '';
        var gpAddress = req.body.gpaddress || '';
        var gpCity = req.body.gpcity || '';
        var gpZipcode = req.body.gpzipcode || '';
        var gpZipcode1 = req.body.gpzipcode1 || '';
        var gpState = req.body.gpstate || '';
        // var gpCountry = req.body.gpcountry || '';
        var gpMailingadd = req.body.gpmailingadd || '';
        //======if mailing address=======
        var gpAddress1 = req.body.gpaddress1 || '';
        var gpCity1 = req.body.gpcity1 || '';
        var gpZipcode2 = req.body.gpzipcode2 || '';
        var gpZipcode3 = req.body.gpzipcode3 || '';
        var gpState1 = req.body.gpstate1 || '';
        //===============================
        var intMobile = req.body.intmobile || '';
        //========Business License Exemption========
        var businessLicense = req.body.blicense || '';
        var resgistrationNo = req.body.NDresgistrationNo || '';
        //==========================================
        var addDBA = req.body.firmName || '';
        //========================================

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
                    emailId: emailId,
                    password: password
                },
                function() {
                    this.emit('message', 'looking for Department with name ' + emailId + password);

                    this.thenEvaluate(function(emailId, password) {
                        document.querySelector('input#username').setAttribute('value', emailId);
                        document.querySelector('input#password').setAttribute('value', password);
                        document.querySelector('input.btn-submit').click(); // Submit form event
                    }, emailId, password);
                }
            ]);

            spooky.waitFor(function() {
                // Capture image to see if scrapped output is perfect or not
                this.captureSelector('check.png', 'div.left-side>nav>ul>li:nth-child(2)>a');
                return (this.exists('div.content-wrap'));
            }, function() {
                //then
                this.thenEvaluate(function() {
                    document.querySelector('div.left-side>nav>ul>li:nth-child(2)>a').click();
                });
            }, function() {
                // timeout
                this.emit('message', 'Timeout occurred');
            }, 5000);


            spooky.waitFor(function() {
                //  this.emit('message', 'loading...');
                this.captureSelector('sample.png', 'div#start-your-business>ul>li:nth-child(1)>a');
                return (this.exists('div.content-wrap'));
            }, function() {
                // then
                this.thenEvaluate(function() {
                    document.querySelector('div#start-your-business>ul>li:nth-child(1)>a').click();
                });
            }, function() {
                // timeout
                this.emit('message', 'Timeout occurred');
            }, 5000);



            //===============Step 1 Type of business=================
            spooky.then([{
                    newNavadaBusiness: newNavadaBusiness
                },
                function() {
                    this.emit('message', 'looking for Department with name ');

                    this.thenEvaluate(function(newbusiness) {
                        // if (['chkSearchStartWith', 'chkSearchIncludes'].indexOf(filter) != -1) {
                        if (newbusiness == "yes") {
                            document.querySelector('input.domesticYes').click();
                        } else if (newbusiness == "no") {
                            document.querySelector('input.domesticNo').click();
                        }
                    }, newNavadaBusiness);
                }
            ]);


            spooky.then([{
                    newNavadaBusiness1: newNavadaBusiness1
                },
                function() {
                    this.emit('message', 'looking for Department with name ');

                    this.thenEvaluate(function(newbusiness1, ) {
                        if (newbusiness1 == "sole") {
                            document.getElementById('sole').click();
                        } else if (newbusiness1 == "partnership") {
                            document.getElementById('partnership').click();
                        } else if (newbusiness1 == "llc") {
                            document.getElementById('llc').click();
                            document.getElementById('hasT7ExemptionNo').click();
                        } else if (newbusiness1 == "corp") {
                            document.getElementById('corp').click();
                            document.querySelector('div.exemptionContentCorp>input:nth-child(3)').click();
                        }
                        document.querySelector('div.navigationBar>input:nth-child(1)').click();
                    }, newNavadaBusiness1);
                }
            ]);
            //=======================================================


            //================Step 2 Nevada Operation=================
            spooky.then([{
                    nevadaLocation: nevadaLocation
                },
                function() {
                    this.emit('message', 'looking for Department with name ');

                    this.thenEvaluate(function(nevadalocation) {
                        if (nevadalocation == "yes") {
                            document.querySelector('fieldset.wizard>div:nth-child(1)>input:nth-child(2)').click();
                        } else if (nevadalocation == "no") {
                            document.querySelector('fieldset.wizard>div:nth-child(1)>input:nth-child(3)').click();
                        }
                        document.querySelector('div.navigationBar>input:nth-child(1)').click();
                    }, nevadaLocation);
                }
            ]);
            //=========================================================== 


            //========Start button even=============== 
            spooky.then([{},
                function() {
                    this.emit('message', 'looking for Department with name ');
                    this.thenEvaluate(function() {
                        document.querySelector('button.btn-mini').click();
                        document.querySelector('button.right').click();
                    });
                }
            ]);
            //========================================



            if (req.body.newbusiness1 == "partnership") {
                spooky.then([{

                        gpTitle: gpTitle,
                        gpFirstname: gpFirstname,
                        gpMiddlename: gpMiddlename,
                        gpLastname: gpLastname,
                        partnershipName: partnershipName

                    },
                    function() {
                        this.emit('message', 'looking for Department with name ');
                        this.thenEvaluate(function(gptitle, gpfname, gpmname, gplname, pname) {
                            document.querySelector('div.form-wrapper>fieldset:nth-child(8)>input').setAttribute('value', gptitle);
                            document.querySelector('div.form-wrapper>fieldset:nth-child(9)>input').setAttribute('value', gpfname);
                            document.querySelector('div.form-wrapper>fieldset:nth-child(10)>input').setAttribute('value', gpmname);
                            document.querySelector('div.form-wrapper>fieldset:nth-child(11)>input').setAttribute('value', gplname);
                            document.querySelector('input.long').setAttribute('value', pname);
                            document.querySelector('div.navigationBar>input:nth-child(1)').click();
                        }, gpTitle, gpFirstname, gpMiddlename, gpLastname, partnershipName);
                    }
                ]);


                spooky.then([{

                        gpAddress: gpAddress,
                        gpCity: gpCity,
                        gpZipcode: gpZipcode,
                        gpZipcode1: gpZipcode1,
                        gpState: gpState,
                        gpMailingadd: gpMailingadd,
                        gpAddress1: gpAddress1,
                        gpCity1: gpCity1,
                        gpZipcode2: gpZipcode2,
                        gpZipcode3: gpZipcode3,
                        gpState1: gpState1,
                        intMobile: intMobile

                    },
                    function() {
                        this.emit('message', 'looking for Department with name ');
                        this.thenEvaluate(function(gpaddress, gpcity, gpzipcode, gpzipcode1, gpstate, gpmailingadd, gpaddress1, gpcity1, gpzipcode2, gpzipcode3, gpstate1, intmobile) {

                            // document.querySelector('div.form-wrapper>fieldset:nth-child(3)>fieldset:nth-child(3)>select:nth-child(12) option[value='+ gpcountry +']').setAttribute('selected', true);
                            document.querySelector('div.form-wrapper>fieldset:nth-child(3)>fieldset:nth-child(3)>div:nth-child(9)>select:nth-child(14) option[value=' + gpstate + ']').setAttribute('selected', true);
                            document.querySelector('div.form-wrapper>fieldset:nth-child(3)>fieldset:nth-child(3)>div:nth-child(9)>input:nth-child(9)').setAttribute('value', gpaddress);
                            document.querySelector('div.form-wrapper>fieldset:nth-child(3)>fieldset:nth-child(3)>div:nth-child(9)>input:nth-child(12)').setAttribute('value', gpcity);
                            document.querySelector('div.form-wrapper>fieldset:nth-child(3)>fieldset:nth-child(3)>div:nth-child(9)>input:nth-child(17)').setAttribute('value', gpzipcode);
                            document.querySelector('div.form-wrapper>fieldset:nth-child(3)>fieldset:nth-child(3)>div:nth-child(9)>input:nth-child(18)').setAttribute('value', gpzipcode1);
                            if (gpmailingadd == "yes") {
                                document.querySelector('input#mailingAddressDifferentCheck').click();
                                document.querySelector('div.form-wrapper>fieldset:nth-child(5)>fieldset:nth-child(1)>div:nth-child(8)>input:nth-child(9)').setAttribute('value', gpaddress1);
                                document.querySelector('div.form-wrapper>fieldset:nth-child(5)>fieldset:nth-child(1)>div:nth-child(8)>input:nth-child(11)').setAttribute('value', gpcity1);
                                // document.querySelector('div.form-wrapper>fieldset:nth-child(5)>fieldset:nth-child(1)>div:nth-child(8)>select:nth-child(13) option[value='+ gpstate1 +']').setAttribute('selected', true);
                                document.querySelector('div.form-wrapper>fieldset:nth-child(5)>fieldset:nth-child(1)>div:nth-child(8)>input:nth-child(16)').setAttribute('value', gpzipcode2);
                                document.querySelector('div.form-wrapper>fieldset:nth-child(5)>fieldset:nth-child(1)>div:nth-child(8)>input:nth-child(17)').setAttribute('value', gpzipcode3);
                            }
                            if (intmobile.yesOrno == "yes") {
                                document.querySelector('input.int-phone-check').click();
                                document.querySelector('input.int-phone-val').setAttribute('value', intmobile.intNumber);
                            } else {
                                document.querySelector('input.areaCode').setAttribute('value', intmobile.gpAreacode);
                                document.querySelector('input.prefix').setAttribute('value', intmobile.gpPrefix);
                                document.querySelector('input.suffix').setAttribute('value', intmobile.gpSuffix);
                            }
                            document.querySelector('div.navigationBar>input:nth-child(1)').click();
                        }, gpAddress, gpCity, gpZipcode, gpZipcode1, gpState, gpMailingadd, gpAddress1, gpCity1, gpZipcode2, gpZipcode3, gpState1, intMobile);
                    }
                ]);



                spooky.then([{
                        businessLicense: businessLicense,
                        resgistrationNo: resgistrationNo
                    },
                    function() {
                        this.emit('message', 'looking for Department with name ');
                        this.thenEvaluate(function(blicense, NDresgistrationNo) {
                            if (blicense.yesOrno == "yes") {
                                document.querySelector('div.form-wrapper>label:nth-child(6)>input').click();
                                if (blicense.companyPursuant.yesOrno == "yes") {
                                    document.querySelector('div.shaded>input:nth-child(2)').click();
                                    if (blicense.companyPursuant.registeredWithND == "yes") {
                                        document.querySelector('div#insurance>input:nth-child(2)').click();
                                        document.querySelector('input.text').setAttribute('value', NDresgistrationNo);
                                    } else {
                                        document.querySelector('div#insurance>input:nth-child(3)').click();
                                    }
                                } else {
                                    document.querySelector('div.shaded>input:nth-child(3)').click();
                                }
                            } else {
                                document.querySelector('div.form-wrapper>label:nth-child(7)>input').click();
                            }

                            if (blicense.homeBasedBusiness.yesOrno == "yes") {
                                document.querySelector('div#questions>div:nth-child(2)>input:nth-child(2)').click();
                                if (blicense.homeBasedBusiness.netEarningLess == "yes") {
                                    document.querySelector('div#homebased>input:nth-child(2)').click();
                                } else {
                                    document.querySelector('div#homebased>input:nth-child(3)').click()
                                }
                                if (blicense.homeBasedBusiness.realProperty == "yes") {
                                    document.querySelector('div#homebased>input:nth-child(5)').click()
                                } else {
                                    document.querySelector('div#homebased>input:nth-child(6)').click()
                                }
                            } else {
                                document.querySelector('div#questions>div:nth-child(2)>input:nth-child(3)').click();
                            }
                            document.querySelector('div.navigationBar>input:nth-child(1)').click();
                        }, businessLicense, resgistrationNo);
                    }
                ]);

                spooky.then([{

                },function(){
                  this.emit('message', 'click next event');
                  this.thenEvaluate(function(){
                    document.querySelector('div.navigationBar>input:nth-child(1)').click();
                  });
                }
                  ]);

                spooky.then([{
                  addDBA: addDBA
                },function(){
                  this.emit('message', 'click next event');
                  this.thenEvaluate(function(firmDetails){
                    document.querySelector('input#addNewbtn').click();
                    document.querySelector('input.medium').setAttribute('value', firmDetails);
                    document.querySelector('div#form-add-new>fieldset:nth-child(2)>select').selectedIndex =2; // need to pass array of index
                    document.querySelector('a.right').click();     
                  },addDBA);
                }
                  ]);

                spooky.then([{
                },function(){
                  this.emit('message', 'click next event');
                  this.thenEvaluate(function(){
                    document.querySelector('div.navigationBar>input:nth-child(1)').click();
                  });
                }
                  ]);
                
                spooky.then([{
                },function(){
                  this.emit('message', 'click next event');
                  this.thenEvaluate(function(){
                    document.querySelector('div.form-wrapper>label:nth-child(5)>input').click();
                    document.querySelector('div.form-wrapper>label:nth-child(7)>input').click();
                    document.querySelector('div.navigationBar>input:nth-child(1)').click();
                  });
                }
                  ]);

                spooky.then([{
                },function(){
                  this.emit('message', 'click next event');
                  this.thenEvaluate(function(){
                    document.querySelector('input.next-btn').click();
                  });
                }
                  ]);

                spooky.then([{
                },function(){
                  this.emit('message', 'click next event');
                  this.thenEvaluate(function(){
                    document.querySelector('a.btn-checkout').click();
                  });
                }
                  ]);

            }

            
            spooky.waitFor(function() {
                //  this.emit('message', 'loading...');
                this.capture('sample123.png');
                // return (this.exists('div.content-wrap'));
            }, function() {
                // then
            }, function() {
                // timeout
                this.emit('message', 'Timeout occurred');
            }, 3000);



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


export default {
    scrapeData: scrapeData
};