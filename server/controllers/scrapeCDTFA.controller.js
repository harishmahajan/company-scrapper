var Spooky = require('spooky');
var _ = require('lodash');

async function scrapeData(req, res, next) {
    console.log('beginning cdtfa scraping process...');

    console.log(req.body);

    if ((req.body.host).indexOf("cdtfa") !== -1) {

        var domainLink = "https://services.cdtfa.ca.gov/ereg/index.boe"; // Link to be scrap

        /*==============Before hit next button===================*/

        var forSR = req.body.forsr || ''; // Selling items or goods in california(1st checkbox)
        var forSU = req.body.forsu || ''; // State for use (2nd checkbox)
        var forCannabis = req.body.forcannabis || ''; // cannabis business activity (3rd checkbox)
        var forSL = req.body.forsl || ''; // Claiming bad debt (4th checkbox)
        var forCarrier = req.body.forcarrier || ''; // Operating as a (5th checkbox)
        var forBusOperator = req.body.forbusoperator || ''; // Exempt Bus Operator (6th checkbox)
        var forTrainOperator = req.body.fortrainopertaor || ''; //Train Operator purchasing fuel (7th checkbox)
        var forUseFuel = req.body.forusefuel || ''; // Fuel products in an exempt manner (8th checkbox)
        var forTk = req.body.fortk || ''; // For Storage tank (9th checkbox) 
        var forAltFuel = req.body.foraltfuel || ''; // Using alternative fuels (10th checkbox)
        var forEmployees = req.body.foremployees || ''; // Employing 10 or more people (11th checkbox)
        var forHG = req.body.forhg || ''; // Generating 5 tons or more of hazardous waste (12th checkbox)
        var forEnergy = req.body.forenergy || ''; // Electrical energy (13th checkbox)
        var forNaturalGas = req.body.naturalgas || ''; // Natural gas checkbox (14th checkbox)
        var forTelephone = req.body.fortelephone || ''; // Service supplier or direct sellar (15th checkbox)
        var forSM = req.body.forsm || ''; // Retail sales of prepaid wireless services

        /*==========================================================*/

        /*==================My business activity includes (Select all that apply. If none, select next.):=================*/
        // ======selling items or goods in california============

        var forAlcohol = req.body.foralcohol || '';
        var forCigarette = req.body.forcigarette || '';
        var forRB = req.body.forrb || '';
        var forER = req.body.forer || '';
        var forSaleFuel = req.body.forsalefuel || '';
        var forSaleLumber = req.body.forsalelumber || '';
        var forRetailSale = req.body.forretailsale || '';
        var forLeadAcidBattery = req.body.acidbattery || '';

        // ========Cannabis business activities ======

        var cannabisCultivation = req.body.cancultivat || '';
        var cannabisDistributer = req.body.candistribute || '';
        var yesDist = req.body.yesdist || '';
        var cannabisMicrobusiness = req.body.canmicrobusiness || '';
        var cannabisTestingLab = req.body.cantestlab || '';

        // =========Operating as a ()=============

        var vettingAnswerForDI = req.body.vettinganswerfordi || '';
        var vettingAnswerForPC = req.body.vettinganswerforpc || '';
        var vettingAnswerForPCRailroad = req.body.vettinganswerforrailroad || '';
        var vettingAnswerForACC1 = req.body.vettinganswerforacc1 || '';
        var vettingAnswerForADC1 = req.body.vettinganswerforadc1 || '';
        var vettingAnswerForRR = req.body.vettinganswerforrr || '';


        // =========Exempt Bus Operator============

        var vettingAnswerForDB = req.body.fordb || '';
        var vettingAnswerForAB = req.body.forab || '';
        var vettingAnswerForABFlat = req.body.forabflat || '';

        // =========Train operator purchasing fuel===

        var vettingAnswerForPT = req.body.forpt || '';

        // ==========Using fuel products============

        var vettingAnswerForDG = req.body.fordg || '';
        var vettingAnswerForDU = req.body.fordu || '';

        // ========Employing 10 or more people=======

        var vettingAnswerForOL = req.body.forol || '';
        var vettingOLSICCode = req.body.vettingcode || '';
        var vettingAnswerForEF = req.body.foref || '';

        // ======Electrical energy service==========

        var vettingAnswerForEC = req.body.forec || '';
        var vettingAnswerForEU = req.body.foreu || '';

        // =======Natural Gas ============

        var vettingAnswerForNC = req.body.fornc || '';
        var vettingAnswerForNU = req.body.fornu || '';
        /*=================================================================================================================*/



        /*============================After second next click=================================*/

        // =======Alcoholic beverages============

        var vettingAnswerForABCLicense = req.body.abclicense || '';
        var vettingAnswerForABV = req.body.vettingabv || '';
        var vettingAnswerForACC = req.body.vettingacc || '';

        // =======Cigarettes and/or Tobacco Products==========

        var vettingAnswerForLR = req.body.vettinglr || '';
        var vettingAnswerForCW = req.body.vettingcw || '';
        var vettingAnswerForCI = req.body.vettingci || '';
        var vettingAnswerForCM = req.body.vettingcm || '';
        var vettingAnswerForCD = req.body.vettingcd || '';
        var vettingAnswerForACTS = req.body.vettingacts || '';
        var vettingAnswerForTW = req.body.vettingtw || '';
        var vettingAnswerForTIM = req.body.vettingtim || '';
        var vettingAnswerForCP = req.body.vettingcp || '';


        // ============Fuel Products===================
        var vettingAnswerForGasStation = req.body.vettingasstation || '';
        var vettingAnswerForGasStationAV = req.body.vettingasstationAV || '';
        var vettingAnswerForGasStationDV = req.body.vettingasstationDV || '';

        var vettingAnswerForAV = req.body.vettingAV || '';
        var vettingAnswerForMJ = req.body.vettingMJ || '';

        var vettingAnswerForBulkDieselDD = req.body.vettingDD || '';
        var vettingAnswerForBulkMotorPS = req.body.vettingPS || '';
        var vettingAnswerForBulkAviationPS = req.body.bulkPS || '';

        var vettingImportDieselDD = req.body.dieselDD || '';
        var vettingImportBioDieselDD = req.body.biodieselDD || '';
        var vettingAnswerForImportMotorPS = req.body.motorPS || '';
        var vettingAnswerForImportAviationPS = req.body.aviationPS || '';

        var vettingAnswerForBlendDieselDD = req.body.blenddieselDD || '';
        var vettingAnswerForBlendBioDieselDD = req.body.blendbiobieselDD || '';
        var vettingAnswerForBlendMotorPS = req.body.blendmotorPS || '';
        var vettingAnswerForBlendAviationPS = req.body.blendaviationPS || '';

        var vettingAnswerForBioDieselDD = req.body.answerbiodieselDD || '';
        var vettingAnswerForPO = req.body.vettingPO || '';
        var vettingAnswerForDV = req.body.vettingDV || '';
        var vettingAnswerForDZ = req.body.vettingDZ || '';
        var vettingAnswerForOA = req.body.vettingOA || '';
        var vettingAnswerForOR = req.body.vettingOR || '';
        // ============================================


        // =====Selling and/or manufacturing lead-acid batteries=======

        var vettingAnswerForBC = req.body.vettingBC || '';
        var vettingAnswerForBR = req.body.vettingBR || '';

        // ============================================================  

        /*====================================================================================*/



        /*===============================ReviewAccount Type===================================*/

        var salesNDusetax = req.body.sndutax || '';
        var useFueltax = req.body.uftax || '';
        var beverageTransportPermit = req.body.btpermit || '';

        //========Alcohol Beverage Tax========     
        var interstateAlcoholTax = req.body.iatax || '';
        var alcoholicTax = req.body.atax || '';
        //====================================
        var cannabisTax = req.body.cantax || '';
        var californiaBatteryfee = req.body.cbfee || '';
        //==========Diesel Fuel Tax===========
        var exemptBustax = req.body.ebtax || '';
        var governmentEntitiestax = req.body.getax || '';
        var interstateDieseltax = req.body.idtax || '';
        var dieselUseraccount = req.body.duseraccount || '';
        //====================================
        //======Energy Resource Survharge Tax==========
        var consumerErergyaccount = req.body.ceatax || '';
        var energyResourceaccount = req.body.eratax || '';
        //====================================
        var environmentalFees = req.body.eftax || '';
        var electronicWastefees = req.body.ewtax || '';
        var hazardousSubstancetax = req.body.hstax || '';
        //==========Natural Gas Surcharge========
        var naturalgasConsumerSurcharge = req.body.ngcsurcharge || '';
        var naturalgasUsersurchargeAccount = req.body.ngusurcharge || '';
        //=======================================
        var occupationPoisionfee = req.body.opfee || '';
        //=======Motor Vehicle Fuel Tax==========
        var vesselOperator = req.body.voperator || '';
        var trainOperatorfuel = req.body.tofuel || '';
        var terminalOperatorLicense = req.body.tolicense || '';
        var fuelSupplierLicense = req.body.fslicense || '';
        var trainOperatorfuelTax = req.body.toftaz || '';
        //=======================================
        var californiaTiretax = req.body.cttax || '';
        var regionalAccidentfee = req.body.raftax || '';
        var prepaidMobilesurcharge = req.body.pmsurcharge || '';
        var undergroundStoragefee = req.body.ugsfee || '';
        var emergencyTelephonesurcharge = req.body.etsurcharge || '';

        //===========Cigarettes and/or Tobacco Products==========
        var tobaccoRetailerLicense = req.body.trlicense || '';
        var tobaccoManufactureLicense = req.body.tmlicense || '';
        var tobaccoWholesalerAccount = req.body.twaccount || '';
        //=======================================================

        var dieselExemptaccount = req.body.deaccount || '';
        var oilSpillResponse = req.body.osresponse || '';
        /*====================================================================================*/

        /*==================================Registration - ABC License========================*/
        var alcoholicBeverageControl = req.body.abcvalue || '';
        var ABClicenseNumber = req.body.abcNumber || '';
        /*====================================================================================*/

        //===================Registration Form =====================
        var Form = req.body.registrationForm;
        //==========================================================
        console.log(req.body.registrationForm.firstName);



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
            spooky.then([{},
                function() {
                    this.emit('message', 'looking for General Informartion of cdtfa with name ');

                    this.thenEvaluate(function() {
                        document.querySelector('form#main>ul>li:nth-child(1)>a:nth-child(2)').click();
                    });
                }
            ]);

            spooky.waitFor(function() {
                // return (this.exists('form#eregBusinessVetting'));
            }, function() {
                // then
            }, function() {
                // timeout
                this.emit('message', 'Timeout occurred');
            }, 3000);



            /*========================First Page=====================*/
            spooky.then([{
                    forSR: forSR,
                    forSU: forSU,
                    forCannabis: forCannabis,
                    forSL: forSL,
                    forCarrier: forCarrier,
                    forBusOperator: forBusOperator,
                    forTrainOperator: forTrainOperator,
                    forUseFuel: forUseFuel,
                    forTk: forTk,
                    forAltFuel: forAltFuel,
                    forEmployees: forEmployees,
                    forHG: forHG,
                    forEnergy: forEnergy,
                    forNaturalGas: forNaturalGas,
                    forTelephone: forTelephone,
                    forSM: forSM
                },
                function() {
                    this.emit('message', 'looking for General Informartion of cdtfa with name ');

                    this.thenEvaluate(function(forsr, forsu, forcannabis, forsl, forcarrier, forbusoperator, fortrainopertaor, forusefuel, fortk, foraltfuel, foremployees, forhg, forenergy, naturalgas, fortelephone, forsm) {

                        if (forsr == "check") {
                            document.getElementById('eregBusinessVetting\:vettingAnswerForSR').click();
                        }
                        if (forsu == "check") {
                            document.getElementById('eregBusinessVetting\:vettingAnswerForSU').click();
                        }
                        if (forcannabis == "check") {
                            document.getElementById('eregBusinessVetting\:vettingAnswerForCannabis').click();
                        }
                        if (forsl == "check") {
                            document.getElementById('eregBusinessVetting\:vettingAnswerForSL').click();
                        }
                        if (forcarrier == "check") {
                            document.getElementById('eregBusinessVetting\:vettingAnswerForCarrier').click();
                        }
                        if (forbusoperator == "check") {
                            document.getElementById('eregBusinessVetting\:vettingAnswerForBusOperator').click();
                        }
                        if (fortrainopertaor == "check") {
                            document.getElementById('eregBusinessVetting\:vettingAnswerForTrainOperator').click();
                        }
                        if (forusefuel == "check") {
                            document.getElementById('eregBusinessVetting\:vettingAnswerForUseFuel').click();
                        }
                        if (fortk == "check") {
                            document.getElementById('eregBusinessVetting\:vettingAnswerForTK').click();
                        }
                        if (foraltfuel == "check") {
                            document.getElementById('eregBusinessVetting\:vettingAnswerForAltFuel').click();
                        }
                        if (foremployees == "check") {
                            document.getElementById('eregBusinessVetting\:vettingAnswerForEmployees').click();
                        }
                        if (forhg == "check") {
                            document.getElementById('eregBusinessVetting\:vettingAnswerForHG').click();
                        }
                        if (forenergy == "check") {
                            document.getElementById('eregBusinessVetting\:vettingAnswerForEnergy').click();
                        }
                        if (naturalgas == "check") {
                            document.getElementById('eregBusinessVetting\:vettingAnswerForNaturalGas').click();
                        }
                        if (fortelephone == "check") {
                            document.getElementById('eregBusinessVetting\:vettingAnswerForTelephone').click();
                        }
                        if (forsm == "check") {
                            document.getElementById('eregBusinessVetting\:vettingAnswerForSM').click();
                        }
                        document.getElementById("eregBusinessVetting\:nextButton").click();
                    }, forSR, forSU, forCannabis, forSL, forCarrier, forBusOperator, forTrainOperator, forUseFuel, forTk, forAltFuel, forEmployees, forHG, forEnergy, forNaturalGas, forTelephone, forSM);
                }
            ]);
            /*========================================================*/


            spooky.waitFor(function() {
                // Capture image to see if scrapped output is perfect or not
                this.capture('firstclick.png');
            }, function() {
                // then
            }, function() {
                // timeout
                this.emit('message', 'Timeout occurred');
            }, 3000);

            /*===================Second page========================*/

            spooky.then([{
                    forAlcohol: forAlcohol,
                    forCigarette: forCigarette,
                    forRB: forRB,
                    forER: forER,
                    forSaleFuel: forSaleFuel,
                    forSaleLumber: forSaleLumber,
                    forRetailSale: forRetailSale,
                    forLeadAcidBattery: forLeadAcidBattery,
                    cannabisCultivation: cannabisCultivation,
                    cannabisDistributer: cannabisDistributer

                },
                function() {
                    if (this.exists('form#eregBusinessVetting')) {
                        this.emit('message', 'found first page ');

                        this.thenEvaluate(function(foralcohol, forcigarette, forrb, forer, forsalefuel, forsalelumber, forretailsale, acidbattery, cancultivat, candistribute) {
                            if (foralcohol == "check") {
                                document.getElementById('vettingAnswerForAlcohol').click();
                            }
                            if (forcigarette == "check") {
                                document.getElementById('vettingAnswerForCigarette').click();
                            }
                            if (forrb == "check") {
                                document.getElementById('vettingAnswerForRB').click();
                            }
                            if (forer == "check") {
                                document.getElementById('vettingAnswerForER').click();
                            }
                            if (forsalefuel == "check") {
                                document.getElementById('vettingAnswerForSaleFuel').click();
                            }
                            if (forsalelumber == "check") {
                                document.getElementById('vettingAnswerForSaleLumber').click();
                            }
                            if (forretailsale == "check") {
                                document.getElementById('vettingAnswerForSM').click();
                            }
                            if (acidbattery == "check") {
                                document.getElementById('vettingAnswerForLeadAcidBattery').click();
                            }
                            if (cancultivat == "check") {
                                document.getElementById('vettingAnswerForCannabisCultivation').click();
                            }
                            if (candistribute == "check") {
                                document.getElementById('vettingAnswerForCannabisDistributor').click();
                            }

                        }, forAlcohol, forCigarette, forRB, forER, forSaleFuel, forSaleLumber, forRetailSale, forLeadAcidBattery, cannabisCultivation, cannabisDistributer);
                    } else {
                        this.emit('message', 'no data available');
                    }
                }
            ]);


            if (req.body.candistribute) {
                if (req.body.yesdist == "yes") {
                    spooky.waitForSelector('span#DistributorPanel>table', function() {
                        this.thenEvaluate(function() {
                            document.querySelector('span#DistributorPanel>table>tbody>tr:nth-child(2)>td:nth-child(2)>table>tbody>tr>td:nth-child(1)>input').click();
                        });
                        this.capture('twitter.png');
                        this.emit('message', 'asd');
                    });
                } else if (req.body.yesdist == "no") {
                    spooky.waitForSelector('span#DistributorPanel>table', function() {
                        this.thenEvaluate(function() {
                            document.querySelector('span#DistributorPanel>table>tbody>tr:nth-child(2)>td:nth-child(2)>table>tbody>tr>td:nth-child(2)>input').click();
                        });
                        this.capture('twitter12.png');
                    });
                }
            }



            spooky.waitFor(function() {
                // Capture image to see if scrapped output is perfect or not
            }, function() {
                // then
            }, function() {
                // timeout
                this.emit('message', 'Timeout occurred');
            }, 3000);



            spooky.then([{
                    cannabisMicrobusiness: cannabisMicrobusiness,
                    cannabisTestingLab: cannabisTestingLab,
                    vettingAnswerForDI: vettingAnswerForDI,
                    vettingAnswerForPC: vettingAnswerForPC,
                    vettingAnswerForPCRailroad: vettingAnswerForPCRailroad,
                    vettingAnswerForACC1: vettingAnswerForACC1,
                    vettingAnswerForADC1: vettingAnswerForADC1,
                    vettingAnswerForRR: vettingAnswerForRR,
                    vettingAnswerForDB: vettingAnswerForDB,
                    vettingAnswerForAB: vettingAnswerForAB

                },
                function() {
                    if (this.exists('form#eregBusinessVetting')) {
                        this.emit('message', 'found first page1');

                        this.thenEvaluate(function(canmicrobusiness, cantestlab, vettinganswerfordi, vettinganswerforpc, vettinganswerforrailroad, vettinganswerforacc1, vettinganswerforadc1, vettinganswerforrr, fordb, forab) {
                            if (canmicrobusiness == "check") {
                                document.getElementById('vettingAnswerForCannabisMicrobusiness').click();
                            }
                            if (cantestlab == "check") {
                                document.getElementById('vettingAnswerForCannabisTestingLaboratory').click();
                            }
                            if (vettinganswerfordi == "check") {
                                document.getElementById('vettingAnswerForDI').click();
                            }
                            if (vettinganswerforpc == "check") {
                                document.getElementById('vettingAnswerForPC').click();
                            }
                            if (vettinganswerforrailroad == "check") {
                                document.getElementById('vettingAnswerForPCRailroad').click();
                            }
                            if (vettinganswerforacc1 == "check") {
                                document.getElementById('vettingAnswerForACC1').click();
                            }
                            if (vettinganswerforadc1 == "check") {
                                document.getElementById('vettingAnswerForADC1').click();
                            }
                            if (vettinganswerforrr == "check") {
                                document.getElementById('vettingAnswerForRR').click();
                            }
                            if (fordb == "check") {
                                document.getElementById('vettingAnswerForDB').click();
                            }
                            if (forab == "check") {
                                document.getElementById('vettingAnswerForAB').click();
                            }

                        }, cannabisMicrobusiness, cannabisTestingLab, vettingAnswerForDI, vettingAnswerForPC, vettingAnswerForPCRailroad, vettingAnswerForACC1, vettingAnswerForADC1, vettingAnswerForRR, vettingAnswerForDB, vettingAnswerForAB);
                    } else {
                        this.emit('message', 'No data available');
                    }
                }
            ]);


            if (req.body.forabflat) {
                spooky.waitForSelector('span#FlatRateABPanel>div', function() {
                    this.thenEvaluate(function() {
                        document.getElementById('vettingAnswerForABFlat').click();
                    });
                    this.emit('message', 'asd');
                });
            }



            spooky.then([{
                    vettingAnswerForPT: vettingAnswerForPT,
                    vettingAnswerForDG: vettingAnswerForDG,
                    vettingAnswerForDU: vettingAnswerForDU,
                    vettingAnswerForOL: vettingAnswerForOL

                },
                function() {
                    if (this.exists('form#eregBusinessVetting')) {
                        this.emit('message', 'found first page3');

                        this.thenEvaluate(function(forpt, fordg, fordu, forol) {
                            if (forpt == "check") {
                                document.getElementById('vettingAnswerForPT').click();
                            }
                            if (fordg == "check") {
                                document.getElementById('vettingAnswerForDG').click();
                            }
                            if (fordu == "check") {
                                document.getElementById('vettingAnswerForDU').click();
                            }
                            if (forol == "check") {
                                document.getElementById('vettingAnswerForOL').click();
                            }

                        }, vettingAnswerForPT, vettingAnswerForDG, vettingAnswerForDU, vettingAnswerForOL);
                    } else {
                        this.emit('message', 'no data available');
                    }
                }
            ]);

            if (req.body.forol) {
                if (req.body.vettingcode == "contractor") {
                    spooky.waitForSelector('span#vettingOLSICCode>table', function() {
                        this.thenEvaluate(function() {
                            document.querySelector('span#vettingOLSICCode>table>tbody>tr:nth-child(2)>td:nth-child(2) #sicCodeType td:nth-child(1)>input').click();
                        });
                    });
                    spooky.waitForSelector('select#OLSICCodeDD', function() {
                        this.thenEvaluate(function() {
                            document.querySelector('select#OLSICCodeDD').selectedIndex = 2; //it is obvious
                        });
                        this.capture('a.png');

                    });
                } else if (req.body.vettingcode == "manufacturer") {
                    spooky.waitForSelector('span#vettingOLSICCode>table', function() {
                        this.thenEvaluate(function() {
                            document.querySelector('span#vettingOLSICCode>table>tbody>tr:nth-child(2)>td:nth-child(2) #sicCodeType td:nth-child(2)>input').click();
                        });
                        this.captureSelector('2.png', 'span#vettingOLSICCode>table>tbody>tr:nth-child(2)>td:nth-child(2) #sicCodeType td:nth-child(2)>input');
                    });
                } else if (req.body.vettingcode == "other") {
                    spooky.waitForSelector('span#vettingOLSICCode>table', function() {
                        this.thenEvaluate(function() {
                            document.querySelector('span#vettingOLSICCode>table>tbody>tr:nth-child(2)>td:nth-child(2) #sicCodeType td:nth-child(3)>input').click();
                        });
                        this.captureSelector('3.png', 'span#vettingOLSICCode>table>tbody>tr:nth-child(2)>td:nth-child(2) #sicCodeType td:nth-child(3)>input');
                    });
                } else if (req.body.vettingcode == "none") {
                    spooky.waitForSelector('span#vettingOLSICCode>table', function() {
                        this.thenEvaluate(function() {
                            document.querySelector('span#vettingOLSICCode>table>tbody>tr:nth-child(2)>td:nth-child(2) #sicCodeType td:nth-child(4)>input').click();
                        });
                        this.captureSelector('4.png', 'span#vettingOLSICCode>table>tbody>tr:nth-child(2)>td:nth-child(2) #sicCodeType td:nth-child(4)>input');
                    });
                }
            }




            spooky.then([{

                    vettingAnswerForEF: vettingAnswerForEF,
                    vettingAnswerForEC: vettingAnswerForEC,
                    vettingAnswerForEU: vettingAnswerForEU,
                    vettingAnswerForNC: vettingAnswerForNC,
                    vettingAnswerForNU: vettingAnswerForNU

                },
                function() {
                    if (this.exists('form#eregBusinessVetting')) {
                        this.emit('message', 'found first page 4');

                        this.thenEvaluate(function(foref, forec, foreu, fornc, fornu) {

                            if (foref == "check") {
                                document.getElementById('vettingAnswerForEF').click();
                            }
                            if (forec == "check") {
                                document.getElementById('vettingAnswerForEC').click();
                            }
                            if (foreu == "check") {
                                document.getElementById('vettingAnswerForEU').click();
                            }
                            if (fornc == "check") {
                                document.getElementById('vettingAnswerForNC').click();
                            }
                            if (fornu == "check") {
                                document.getElementById('vettingAnswerForNU').click();
                            }
                            document.getElementById('nextButton').click();
                        }, vettingAnswerForEF, vettingAnswerForEC, vettingAnswerForEU, vettingAnswerForNC, vettingAnswerForNU);
                    } else {
                        this.emit('message', 'No data available');
                    }
                }
            ]);



            /*=======================================================*/

            spooky.waitFor(function() {
                // Capture image to see if scrapped output is perfect or not
                this.capture('secondclick.png');
                // return (this.exists('form#eregBusinessVetting'));
            }, function() {
                // then
            }, function() {
                // timeout
                this.emit('message', 'Timeout occurred');
            }, 3000);

            /*====================eregBusinessVetting Page=========================*/

            spooky.then([{
                    vettingAnswerForABCLicense: vettingAnswerForABCLicense,
                    vettingAnswerForABV: vettingAnswerForABV,
                    vettingAnswerForACC: vettingAnswerForACC,
                    vettingAnswerForLR: vettingAnswerForLR,
                    vettingAnswerForCW: vettingAnswerForCW,
                    vettingAnswerForCI: vettingAnswerForCI,
                    vettingAnswerForCM: vettingAnswerForCM,
                    vettingAnswerForCD: vettingAnswerForCD,
                    vettingAnswerForACTS: vettingAnswerForACTS,
                    vettingAnswerForTW: vettingAnswerForTW,
                    vettingAnswerForTIM: vettingAnswerForTIM,
                    vettingAnswerForCP: vettingAnswerForCP,
                    vettingAnswerForGasStation: vettingAnswerForGasStation
                    // vettingAnswerForGasStationAV: vettingAnswerForGasStationAV,
                    // vettingAnswerForGasStationDV: vettingAnswerForGasStationDV

                },
                function() {
                    if (this.exists('form#eregBusinessVetting')) {
                        this.emit('message', 'found second page1');
                        this.thenEvaluate(function(abclicense, vettingabv, vettingacc, vettinglr, vettingcw, vettingci, vettingcm, vettingcd, vettingacts, vettingtw, vettingtim, vettingcp, vettingasstation) {

                            if (abclicense == "check") {
                                document.getElementById('eregBusinessVetting\:vettingAnswerForABCLicense').click();
                            }
                            if (vettingabv == "check") {
                                document.getElementById('eregBusinessVetting\:vettingAnswerForABV').click();
                            }
                            if (vettingacc == "check") {
                                document.getElementById('eregBusinessVetting\:vettingAnswerForACC').click();
                            }
                            if (vettinglr == "check") {
                                document.getElementById('eregBusinessVetting\:vettingAnswerForLR').click();
                            }
                            if (vettingcw == "check") {
                                document.getElementById('eregBusinessVetting\:vettingAnswerForCW').click();
                            }
                            if (vettingci == "check") {
                                document.getElementById('eregBusinessVetting\:vettingAnswerForCI').click();
                            }
                            if (vettingcm == "check") {
                                document.getElementById('eregBusinessVetting\:vettingAnswerForCM').click();
                            }
                            if (vettingcd == "check") {
                                document.getElementById('eregBusinessVetting\:vettingAnswerForCD').click();
                            }
                            if (vettingacts == "check") {
                                document.getElementById('eregBusinessVetting\:vettingAnswerForACTS').click();
                            }
                            if (vettingtw == "check") {
                                document.getElementById('eregBusinessVetting\:vettingAnswerForTW').click();
                            }
                            if (vettingtim == "check") {
                                document.getElementById('eregBusinessVetting\:vettingAnswerForTIM').click();
                            }
                            if (vettingcp == "check") {
                                document.getElementById('eregBusinessVetting\:vettingAnswerForCP').click();
                            }
                            if (vettingasstation == "check") {
                                document.getElementById('eregBusinessVetting\:vettingAnswerForGasStation').click();
                            }
                            // if (vettingasstationAV == "check") {
                            //     document.getElementById('eregBusinessVetting\:vettingAnswerForGasStationAV').click();
                            // }if (vettingasstationDV == "check") {
                            //     document.getElementById('eregBusinessVetting\:vettingAnswerForGasStationDV').click();
                            // }
                        }, vettingAnswerForABCLicense, vettingAnswerForABV, vettingAnswerForACC, vettingAnswerForLR, vettingAnswerForCW, vettingAnswerForCI, vettingAnswerForCM, vettingAnswerForCD, vettingAnswerForACTS, vettingAnswerForTW, vettingAnswerForTIM, vettingAnswerForCP, vettingAnswerForGasStation);
                    } else {
                        this.emit('message', 'No data available');
                    }
                }
            ]);

            // ============below part remaining============ 
            // spooky.waitForSelector('form#eregBusinessVetting>div', function() {
            //     this.thenEvaluate(function(){
            //         document.getElementById('eregBusinessVetting\:vettingAnswerForGasStationDV').click();
            //     });
            //     this.capture('abcd.png');
            // });
            // ==========================================

            spooky.then([{

                    vettingAnswerForAV: vettingAnswerForAV,
                    vettingAnswerForMJ: vettingAnswerForMJ,
                    vettingAnswerForBulkDieselDD: vettingAnswerForBulkDieselDD,
                    vettingAnswerForBulkMotorPS: vettingAnswerForBulkMotorPS,
                    vettingAnswerForBulkAviationPS: vettingAnswerForBulkAviationPS,
                    vettingImportDieselDD: vettingImportDieselDD,
                    vettingImportBioDieselDD: vettingImportBioDieselDD,
                    vettingAnswerForImportMotorPS: vettingAnswerForImportMotorPS,
                    vettingAnswerForImportAviationPS: vettingAnswerForImportAviationPS,
                    vettingAnswerForBlendDieselDD: vettingAnswerForBlendDieselDD,
                    vettingAnswerForBlendBioDieselDD: vettingAnswerForBlendBioDieselDD,
                    vettingAnswerForBlendMotorPS: vettingAnswerForBlendMotorPS,
                    vettingAnswerForBlendAviationPS: vettingAnswerForBlendAviationPS,
                    vettingAnswerForBioDieselDD: vettingAnswerForBioDieselDD,
                    vettingAnswerForPO: vettingAnswerForPO,
                    vettingAnswerForDV: vettingAnswerForDV,
                    vettingAnswerForDZ: vettingAnswerForDZ,
                    vettingAnswerForOA: vettingAnswerForOA,
                    vettingAnswerForOR: vettingAnswerForOR,
                    vettingAnswerForBC: vettingAnswerForBC,
                    vettingAnswerForBR: vettingAnswerForBR

                },
                function() {
                    if (this.exists('form#eregBusinessVetting')) {
                        this.emit('message', 'found second page2');
                        this.thenEvaluate(function(vettingAV, vettingMJ, vettingDD, vettingPS, bulkPS, dieselDD, biodieselDD, motorPS, aviationPS, blenddieselDD, blendbiobieselDD, blendmotorPS, blendaviationPS, answerbiodieselDD, vettingPO, vettingDV, vettingDZ, vettingOA, vettingOR, vettingBC, vettingBR) {

                            if (vettingAV == "check") {
                                document.getElementById('eregBusinessVetting\:vettingAnswerForAV').click();
                            }
                            if (vettingMJ == "check") {
                                document.getElementById('eregBusinessVetting\:vettingAnswerForMJ').click();
                            }
                            if (vettingDD == "check") {
                                document.getElementById('eregBusinessVetting\:vettingAnswerForBulkDieselDD').click();
                            }
                            if (vettingPS == "check") {
                                document.getElementById('eregBusinessVetting\:vettingAnswerForBulkMotorPS').click();
                            }
                            if (bulkPS == "check") {
                                document.getElementById('eregBusinessVetting\:vettingAnswerForBulkAviationPS').click();
                            }
                            if (dieselDD == "check") {
                                document.getElementById('eregBusinessVetting\:vettingAnswerForImportDieselDD').click();
                            }
                            if (biodieselDD == "check") {
                                document.getElementById('eregBusinessVetting\:vettingAnswerForImportBioDieselDD').click();
                            }
                            if (motorPS == "check") {
                                document.getElementById('eregBusinessVetting\:vettingAnswerForImportMotorPS').click();
                            }
                            if (aviationPS == "check") {
                                document.getElementById('eregBusinessVetting\:vettingAnswerForImportAviationPS').click();
                            }
                            if (blenddieselDD == "check") {
                                document.getElementById('eregBusinessVetting\:vettingAnswerForBlendDieselDD').click();
                            }
                            if (blendbiobieselDD == "check") {
                                document.getElementById('eregBusinessVetting\:vettingAnswerForBlendBioDieselDD').click();
                            }
                            if (blendmotorPS == "check") {
                                document.getElementById('eregBusinessVetting\:vettingAnswerForBlendMotorPS').click();
                            }
                            if (blendaviationPS == "check") {
                                document.getElementById('eregBusinessVetting\:vettingAnswerForBlendAviationPS').click();
                            }
                            if (answerbiodieselDD == "check") {
                                document.getElementById('eregBusinessVetting\:vettingAnswerForBioDieselDD').click();
                            }
                            if (vettingPO == "check") {
                                document.getElementById('eregBusinessVetting\:vettingAnswerForPO').click();
                            }
                            if (vettingDV == "check") {
                                document.getElementById('eregBusinessVetting\:vettingAnswerForDV').click();
                            }
                            if (vettingDZ == "check") {
                                document.getElementById('eregBusinessVetting\:vettingAnswerForDZ').click();
                            }
                            if (vettingOA == "check") {
                                document.getElementById('eregBusinessVetting\:vettingAnswerForOA').click();
                            }
                            if (vettingOR == "check") {
                                document.getElementById('eregBusinessVetting\:vettingAnswerForOR').click();
                            }
                            if (vettingBC == "check") {
                                document.getElementById('eregBusinessVetting\:vettingAnswerForBC').click();
                            }
                            if (vettingBR == "check") {
                                document.getElementById('eregBusinessVetting\:vettingAnswerForBR').click();
                            }
                            document.getElementById('eregBusinessVetting\:nextButton').click();
                        }, vettingAnswerForAV, vettingAnswerForMJ, vettingAnswerForBulkDieselDD, vettingAnswerForBulkMotorPS, vettingAnswerForBulkAviationPS, vettingImportDieselDD, vettingImportBioDieselDD, vettingAnswerForImportMotorPS, vettingAnswerForImportAviationPS, vettingAnswerForBlendDieselDD, vettingAnswerForBlendBioDieselDD, vettingAnswerForBlendMotorPS, vettingAnswerForBlendAviationPS, vettingAnswerForBioDieselDD, vettingAnswerForPO, vettingAnswerForDV, vettingAnswerForDZ, vettingAnswerForOA, vettingAnswerForOR, vettingAnswerForBC, vettingAnswerForBR);
                    } else {
                        this.emit('message', 'No data available');
                    }
                }
            ]);

            /*=======================================================*/


            spooky.waitFor(function() {
                // Capture image to see if scrapped output is perfect or not
                this.capture('finaloutput.png');
                // return (this.exists('form#eregBusinessVetting'));
            }, function() {
                // then
            }, function() {
                // timeout
                this.emit('message', 'Timeout occurred');
            }, 3000);


           // =============ABC License================== 

            spooky.then([{

                    alcoholicBeverageControl: alcoholicBeverageControl,  
                    ABClicenseNumber: ABClicenseNumber 

                },
                function() {
                    if (this.exists('form#eregForm')) {
                        this.emit('message', 'found abc license page 4');

                        this.thenEvaluate(function(abcvalue,abcNumber) {
                            document.getElementById(abcvalue).click(); // j_id70:0 or j_id70:1
                            document.getElementById('abcNumber').setAttribute('value', abcNumber);
                            document.getElementById('addLicLink').click();
                            document.getElementById('nextButton').click();
                        }, alcoholicBeverageControl, ABClicenseNumber);
                    } else {
                        this.emit('message', 'No data available');
                    }
                }
            ]);

            // ===========================================


            spooky.waitFor(function() {
                    // Capture image to see if scrapped output is perfect or not
                    this.capture('finale.png');
                    // return (this.exists('form#eregBusinessVetting'));
                }, function() {
                    // then
                }, function() {
                    // timeout
                    this.emit('message', 'Timeout occurred');
                }, 3000);


                /*=========================reviewAccountType====================*/

                spooky.then([{
                        salesNDusetax: salesNDusetax,
                        useFueltax: useFueltax,
                        beverageTransportPermit: beverageTransportPermit,
                        interstateAlcoholTax: interstateAlcoholTax,
                        alcoholicTax: alcoholicTax,
                        cannabisTax: cannabisTax,
                        californiaBatteryfee: californiaBatteryfee,
                        exemptBustax: exemptBustax,
                        governmentEntitiestax: governmentEntitiestax,
                        interstateDieseltax: interstateDieseltax,
                        dieselUseraccount: dieselUseraccount,
                        consumerErergyaccount: consumerErergyaccount,
                        energyResourceaccount: energyResourceaccount,
                        environmentalFees: environmentalFees,
                        electronicWastefees: electronicWastefees,
                        hazardousSubstancetax: hazardousSubstancetax,
                        naturalgasConsumerSurcharge: naturalgasConsumerSurcharge,
                        naturalgasUsersurchargeAccount: naturalgasUsersurchargeAccount,
                        occupationPoisionfee: occupationPoisionfee,
                        vesselOperator: vesselOperator,
                        trainOperatorfuel: trainOperatorfuel,
                        terminalOperatorLicense: terminalOperatorLicense,
                        fuelSupplierLicense: fuelSupplierLicense,
                        trainOperatorfuelTax: trainOperatorfuelTax,
                        californiaTiretax: californiaTiretax,
                        regionalAccidentfee: regionalAccidentfee,
                        prepaidMobilesurcharge: prepaidMobilesurcharge,
                        undergroundStoragefee: undergroundStoragefee,
                        emergencyTelephonesurcharge: emergencyTelephonesurcharge,
                        tobaccoRetailerLicense: tobaccoRetailerLicense,
                        tobaccoManufactureLicense: tobaccoManufactureLicense,
                        tobaccoWholesalerAccount: tobaccoWholesalerAccount,
                        dieselExemptaccount: dieselExemptaccount,
                        oilSpillResponse: oilSpillResponse

                    },
                    function() {
                        if (this.exists('form#reviewAccountType')) {
                        this.emit('message', '1');
                        this.thenEvaluate(function(sndutax, uftax, btpermit, iatax, atax, cantax, cbfee, ebtax, getax, idtax, duseraccount, ceatax, eratax, eftax, ewtax, hstax, ngcsurcharge, ngusurcharge, opfee, voperator, tofuel, tolicense, fslicense, toftaz, cttax, raftax, pmsurcharge, ugsfee, etsurcharge, trlicense, tmlicense, twaccount, deaccount, osresponse) {

                            if (sndutax == "check") {
                                document.getElementById('reviewAccountType\:categoryTable\:0\:accountTypeSubTable\:0\:taxProgramCheckbox').click();
                            }
                            if (uftax == "check") {
                                document.getElementById('reviewAccountType\:categoryTable\:1\:accountTypeSubTable\:0\:taxProgramCheckbox').click();
                            }
                            if (btpermit == "check") {
                                document.getElementById('reviewAccountType\:categoryTable\:1\:accountTypeSubTable\:1\:taxProgramCheckbox').click();
                            }
                            if (iatax == "check") {
                                document.getElementById('reviewAccountType\:categoryTable\:2\:accountTypeSubTable\:0\:taxProgramCheckbox').click();
                            }
                            if (atax == "check") {
                                document.getElementById('reviewAccountType\:categoryTable\:2\:accountTypeSubTable\:1\:taxProgramCheckbox').click();
                            }
                            if (cantax == "check") {
                                document.getElementById('reviewAccountType\:categoryTable\:3\:accountTypeSubTable\:0\:taxProgramCheckbox').click();
                            }
                            if (cbfee == "check") {
                                document.getElementById('reviewAccountType\:categoryTable\:3\:accountTypeSubTable\:1\:taxProgramCheckbox').click();
                            }
                            if (ebtax == "check") {
                                document.getElementById('reviewAccountType\:categoryTable\:4\:accountTypeSubTable\:0\:taxProgramCheckbox').click();
                            }
                            if (getax == "check") {
                                document.getElementById('reviewAccountType\:categoryTable\:4\:accountTypeSubTable\:1\:taxProgramCheckbox').click();
                            }
                            if (idtax == "check") {
                                document.getElementById('reviewAccountType\:categoryTable\:4\:accountTypeSubTable\:2\:taxProgramCheckbox').click();
                            }
                            if (duseraccount == "check") {
                                document.getElementById('reviewAccountType\:categoryTable\:4\:accountTypeSubTable\:3\:taxProgramCheckbox').click();
                            }
                            if (ceatax == "check") {
                                document.getElementById('reviewAccountType\:categoryTable\:5\:accountTypeSubTable\:0\:taxProgramCheckbox').click();
                            }
                            if (eratax == "check") {
                                document.getElementById('reviewAccountType\:categoryTable\:5\:accountTypeSubTable\:1\:taxProgramCheckbox').click();
                            }
                            if (eftax == "check") {
                                document.getElementById('reviewAccountType\:categoryTable\:6\:accountTypeSubTable\:0\:taxProgramCheckbox').click();
                            }
                            if (ewtax == "check") {
                                document.getElementById('reviewAccountType\:categoryTable\:7\:accountTypeSubTable\:0\:taxProgramCheckbox').click();
                            }
                            if (hstax == "check") {
                                document.getElementById('reviewAccountType\:categoryTable\:8\:accountTypeSubTable\:0\:taxProgramCheckbox').click();
                            }
                            if (ngcsurcharge == "check") {
                                document.getElementById('reviewAccountType\:categoryTable\:9\:accountTypeSubTable\:0\:taxProgramCheckbox').click();
                            }
                            if (ngusurcharge == "check") {
                                document.getElementById('reviewAccountType\:categoryTable\:9\:accountTypeSubTable\:1\:taxProgramCheckbox').click();
                            }
                            if (opfee == "check") {
                                document.getElementById('reviewAccountType\:categoryTable\:10\:accountTypeSubTable\:0\:taxProgramCheckbox').click();
                            }
                            if (voperator == "check") {
                                document.getElementById('reviewAccountType\:categoryTable\:11\:accountTypeSubTable\:0\:taxProgramCheckbox').click();
                            }
                            if (tofuel == "check") {
                                document.getElementById('reviewAccountType\:categoryTable\:11\:accountTypeSubTable\:1\:taxProgramCheckbox').click();
                            }
                            if (tolicense == "check") {
                                document.getElementById('reviewAccountType\:categoryTable\:7\:accountTypeSubTable\:1\:taxProgramCheckbox').click();
                            }
                            if (fslicense == "check") {
                                document.getElementById('reviewAccountType\:categoryTable\:7\:accountTypeSubTable\:2\:taxProgramCheckbox').click();
                            }
                            if (toftaz == "check") {
                                document.getElementById('reviewAccountType\:categoryTable\:7\:accountTypeSubTable\:3\:taxProgramCheckbox').click();
                            }
                            if (cttax == "check") {
                                document.getElementById('reviewAccountType\:categoryTable\:12\:accountTypeSubTable\:0\:taxProgramCheckbox').click();
                            }
                            if (raftax == "check") {
                                document.getElementById('reviewAccountType\:categoryTable\:13\:accountTypeSubTable\:0\:taxProgramCheckbox').click();
                            }
                            if (pmsurcharge == "check") {
                                document.getElementById('reviewAccountType\:categoryTable\:14\:accountTypeSubTable\:0\:taxProgramCheckbox').click();
                            }
                            if (ugsfee == "check") {
                                document.getElementById('reviewAccountType\:categoryTable\:15\:accountTypeSubTable\:0\:taxProgramCheckbox').click();
                            }
                            if (etsurcharge == "check") {
                                document.getElementById('reviewAccountType\:categoryTable\:16\:accountTypeSubTable\:0\:taxProgramCheckbox').click();
                            }
                            if (trlicense == "check") {
                                document.getElementById('reviewAccountType\:categoryTable\:4\:accountTypeSubTable\:4\:taxProgramCheckbox').click();
                            }
                            if (tmlicense == "check") {
                                document.getElementById('reviewAccountType\:categoryTable\:4\:accountTypeSubTable\:5\:taxProgramCheckbox').click();
                            }
                            if (twaccount == "check") {
                                document.getElementById('reviewAccountType\:categoryTable\:4\:accountTypeSubTable\:6\:taxProgramCheckbox').click();
                            }
                            if (deaccount == "check") {
                                document.getElementById('reviewAccountType\:categoryTable\:5\:accountTypeSubTable\:2\:taxProgramCheckbox').click();
                            }
                            if (osresponse == "check") {
                                document.getElementById('reviewAccountType\:categoryTable\:8\:accountTypeSubTable\:1\:taxProgramCheckbox').click();
                            }
                            document.getElementById('reviewAccountType\:nextButton').click();
                        }, salesNDusetax, useFueltax, beverageTransportPermit, interstateAlcoholTax, alcoholicTax, cannabisTax, californiaBatteryfee, exemptBustax, governmentEntitiestax, interstateDieseltax, dieselUseraccount, consumerErergyaccount, energyResourceaccount, environmentalFees, electronicWastefees, hazardousSubstancetax, naturalgasConsumerSurcharge, naturalgasUsersurchargeAccount, occupationPoisionfee, vesselOperator, trainOperatorfuel, terminalOperatorLicense, fuelSupplierLicense, trainOperatorfuelTax, californiaTiretax, regionalAccidentfee, prepaidMobilesurcharge, undergroundStoragefee, emergencyTelephonesurcharge, tobaccoRetailerLicense, tobaccoManufactureLicense, tobaccoWholesalerAccount, dieselExemptaccount, oilSpillResponse);
                    }else{
                        this.emit('message', 'No data available');
                    }
                }
            ]);

            /*==============================================================*/


            spooky.then([{
                },
                function() {
                    if (this.exists('form#login')) {
                        this.emit('message', 'Declaration of Intent 1');
                        this.thenEvaluate(function() {
                            document.querySelector('form#login>table>tbody>tr>td>table>tbody>tr>td:nth-child(1)>input').click();
                        },);
                    } else {
                        this.emit('message', 'No data available');
                    }
                }
            ]);

            spooky.then([{
                },
                function() {
                    if (this.exists('form#login')) {
                        this.emit('message', 'Declaration of Intent 2');
                        this.thenEvaluate(function() {
                            document.querySelector('form#login>table>tbody>tr>td>table>tbody>tr>td:nth-child(1)>input').click();
                        },);
                    } else {
                        this.emit('message', 'No data available');
                    }
                }
            ]);

            spooky.then([{
                },
                function() {
                    if (this.exists('form#iftaAcknowledgementForm')) {
                        this.emit('message', 'Acknwledgement Form');
                        this.thenEvaluate(function() {
                            document.querySelector('form#iftaAcknowledgementForm>table>tbody>tr:nth-child(8)>td>table>tbody>tr>td:nth-child(1)>input').click();
                        },);
                    } else {
                        this.emit('message', 'No data available');
                    }
                }
            ]);
                

           spooky.waitFor(function() {
                    // Capture image to see if scrapped output is perfect or not
                    this.captureSelector('select.png', 'select#preparerOwnershipType');
                    // return (this.exists('form#eregBusinessVetting'));
                }, function() {
                    // then
                }, function() {
                    // timeout
                    this.emit('message', 'Timeout occurred');
                }, 3000);


            spooky.then([{
                    form : Form
                },
                function() {
                        this.thenEvaluate(function(registrationForm) {
                            document.querySelector('input#preparerFirstName').setAttribute('value', registrationForm.firstName);
                            document.querySelector('input#preparermiddleInitial').setAttribute('value', registrationForm.middleName);
                            document.querySelector('input#preparerLastName').setAttribute('value', registrationForm.lastName);
                            document.querySelector('input#preparerEmailAddress').setAttribute('value', registrationForm.emailId);
                            document.querySelector('input#preparerVerifyEmailAddress').setAttribute('value', registrationForm.reenterEmail);
                            document.querySelector('input#preparerUserID').setAttribute('value', registrationForm.userId);
                            document.querySelector('input#preparerVerifyUserID').setAttribute('value', registrationForm.confirmUserId);
                            document.querySelector('input#preparerPassword').setAttribute('value', registrationForm.Password);
                            document.querySelector('input#preparerVerifyPassword').setAttribute('value', registrationForm.reenterPassword);
                            // document.querySelector('input[type=hidden] [id=preparerQuestioncomboboxValue]').setAttribute('value',"asasasd");
                            document.querySelector('input#preparerAnswer').setAttribute('value', registrationForm.answer);
                            if(registrationForm.multipleBusiness == "yes"){
                             document.querySelector('table#preparerMultipleLocations>tbody>tr>td:nth-child(1)>input').click();
                            }else{
                             document.querySelector('table#preparerMultipleLocations>tbody>tr>td:nth-child(2)>input').click();
                            }

                        },form);
                }
            ]);


            spooky.waitFor(function() {
                this.capture('aaas.png');
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