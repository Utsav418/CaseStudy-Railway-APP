process.env.NODE_ENV = 'test';
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
const should = chai.should();
chai.should();


chai.use(chaiHttp)

// ******** Testing begins Here ******** //

describe('Trains', () => {
    beforeEach((done) => { //Before each test we empty the database
        Trains.remove({}, (err) => {
            done();
        });
    });

    //  * Test the /GET route *

    describe('GET Trains', () => {
        it('it should GET all the Trains', (done) => {
            chai.request(server)
                .get('/api/trains1')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    // res.body.length.should.be.eql(0);
                    done();
                });
        });
    });


    //  * Test the /POST route *

    describe('/POST Train', () => {
        it('it should not POST a Train without Train Name  field', (done) => {
            let train = {
                trainNo: 2822,
                trainName: "SRC-PUNE AC SF SPL",
                runsFromStn: "SAT",
                src: "SANTRAGACHI JN",
                srcCode: "SRC",
                dstn: "PUNE JN",
                dstnCode: "PUNE",
                fromStn: "SANTRAGACHI JN",
                fromStnCode: "SRC",
                toStn: "KALYAN JN",
                toStnCode: "KYN",
                depAtFromStn: "18:30",
                arrAtToStn: "22:40",
                travelTime: "28:10:00",
                trainType: "HSP",
                AC1Tier: 4920,
                AC2Tier: 2855,
                sleeperClass: 740
            }
            chai.request(server)
                .post('/api/trains1/')
                .send(train)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('dstn');
                    done();
                });
        });

        //     //  * Test the /POST route  With All Filelds

        describe('/POST Train', () => {
            it('it should not POST a Train without Train Name  field', (done) => {
                let train = {
                    trainNo: 2822,
                    trainName: "SRC-PUNE AC SF SPL",
                    runsFromStn: "SAT",
                    src: "SANTRAGACHI JN",
                    srcCode: "SRC",
                    dstn: "PUNE JN",
                    dstnCode: "PUNE",
                    fromStn: "SANTRAGACHI JN",
                    fromStnCode: "SRC",
                    toStn: "KALYAN JN",
                    toStnCode: "KYN",
                    depAtFromStn: "18:30",
                    arrAtToStn: "22:40",
                    travelTime: "28:10:00",
                    trainType: "HSP",
                    AC1Tier: 4920,
                    AC2Tier: 2855,
                    sleeperClass: 740
                }
                chai.request(server)
                    .post('/api/trains1/')
                    .send(train)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('trainNo');
                        res.body.should.have.property('trainName');
                        res.body.should.have.property('runsFromStn');
                        res.body.should.have.property('src');
                        res.body.should.have.property('srcCode');
                        res.body.should.have.property('dstn');
                        res.body.should.have.property('dstnCode');
                        res.body.should.have.property('fromStn');
                        res.body.should.have.property('fromStnCode');
                        res.body.should.have.property('toStn');
                        res.body.should.have.property('toStnCode');
                        res.body.should.have.property('depAtFromStn');
                        res.body.should.have.property('arrAtToStn');
                        res.body.should.have.property('travelTime');
                        res.body.should.have.property('trainType');
                        res.body.should.have.property('AC1Tier');
                        res.body.should.have.property('AC2Tier');
                        res.body.should.have.property('sleeperClass');


                        done();
                    });
            });
            // * Test the /GET/:id route
            describe('/GET:id Train', () => {
                it('it should GET a Train by the given id ', (done) => {
                    let train = new Trains({
                        trainNo: 2822,
                        trainName: "SRC-PUNE AC SF SPL",
                        runsFromStn: "SAT",
                        src: "SANTRAGACHI JN",
                        srcCode: "SRC",
                        dstn: "PUNE JN",
                        dstnCode: "PUNE",
                        fromStn: "SANTRAGACHI JN",
                        fromStnCode: "SRC",
                        toStn: "KALYAN JN",
                        toStnCode: "KYN",
                        depAtFromStn: "18:30",
                        arrAtToStn: "22:40",
                        travelTime: "28:10:00",
                        trainType: "HSP",
                        AC1Tier: 4920,
                        AC2Tier: 2855,
                        sleeperClass: 740
                    })
                    train.save((err, train) => {
                        chai.request(server)
                            .get('/api/trains1/' + train.id)
                            .send(train)
                            .end((err, res) => {
                                res.should.have.status(200);
                                res.body.should.be.a('object');
                                res.body.should.have.property('dstn');
                                res.body.should.have.property('dstnCode');
                                res.body.should.have.property('fromStn');
                                res.body.should.have.property('fromStnCode');
                                res.body.should.have.property('toStn');
                                res.body.should.have.property('_id').eql(train.id);
                                done();

                            });
                    });
                });
            });

            // * Test the /PUT/:id route
            describe('/PUT:id train', () => {
                it('it should  UPDATE a train  given the id', (done) => {
                    let train = new Trains({
                        trainNo: 2822,
                        trainName: "SRC-PUNE AC SF SPL",
                        runsFromStn: "SAT",
                        src: "SANTRAGACHI JN",
                        srcCode: "SRC",
                        dstn: "PUNE JN",
                        dstnCode: "PUNE",
                        fromStn: "SANTRAGACHI JN",
                        fromStnCode: "SRC",
                        toStn: "KALYAN JN",
                        toStnCode: "KYN",
                        depAtFromStn: "18:30",
                        arrAtToStn: "22:40",
                        travelTime: "28:10:00",
                        trainType: "HSP",
                        AC1Tier: 4920,
                        AC2Tier: 2855,
                        sleeperClass: 740

                    })
                    train.save((err, train) => {
                        chai.request(server)
                            .put('/api/trains1/' + train.id)
                            .send({
                                trainNo: 2822,
                                trainName: "JSR-PUNE AC SF SPL",
                                runsFromStn: "SAT",
                                src: "SANTRAGACHI JN",
                                srcCode: "SRC",
                                dstn: "PUNE JN",
                                dstnCode: "PUNE",
                                fromStn: "SANTRAGACHI JN",
                                fromStnCode: "SRC",
                                toStn: "KALYAN JN",
                                toStnCode: "KYN",
                                depAtFromStn: "18:30",
                                arrAtToStn: "22:40",
                                travelTime: "28:10:00",
                                trainType: "HSP",
                                AC1Tier: 4920,
                                AC2Tier: 2855,
                                sleeperClass: 740
                            })
                            .end((err, res) => {
                                res.should.have.status(200);
                                res.body.should.be.a('object');
                                res.body.should.have.property('dstn');
                                res.body.should.have.property('dstnCode');
                                res.body.should.have.property('fromStn');
                                res.body.should.have.property('fromStnCode');
                                res.body.should.have.property('toStn');
                                res.body.should.have.property('trainName').eql("JSR-PUNE AC SF SPL");
                                done();

                            });
                    });
                });
            });
        });

        // * Test the /DELETE/:id route

        describe('/DELETE:id train', () => {
            it('it should  DELETE a train given the id ', (done) => {
                let train = new Trains({
                    trainNo: 2822,
                    trainName: "SRC-PUNE AC SF SPL",
                    runsFromStn: "SAT",
                    src: "SANTRAGACHI JN",
                    srcCode: "SRC",
                    dstn: "PUNE JN",
                    dstnCode: "PUNE",
                    fromStn: "SANTRAGACHI JN",
                    fromStnCode: "SRC",
                    toStn: "KALYAN JN",
                    toStnCode: "KYN",
                    depAtFromStn: "18:30",
                    arrAtToStn: "22:40",
                    travelTime: "28:10:00",
                    trainType: "HSP",
                    AC1Tier: 4920,
                    AC2Tier: 2855,
                    sleeperClass: 740

                })
                train.save((err, train) => {
                    chai.request(server)
                        .delete('/api/trains1/' + train.id)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.should.have.property('dstn');
                            res.body.should.have.property('dstnCode');
                            res.body.should.have.property('fromStn');
                            res.body.should.have.property('fromStnCode');
                            res.body.should.have.property('toStn');
                            // res.body.should.have.property('ok').eql(1);
                            // res.body.should.have.property('n').eql(1);
                            done();

                        });
                });
            })
        });
    });
});