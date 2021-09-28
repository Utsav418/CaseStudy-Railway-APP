process.env.NODE_ENV = 'test';
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
const should = chai.should();
chai.should();

chai.use(chaiHttp)

// ******** Testing begins Here ******** //

describe('OTP', () => {
    // beforeEach((done) => { //Before each test we empty the database
    //     Stations.remove({}, (err) => {
    //         done();
    //     });
    // });

    //  * Test the /GET route *

    describe('GET Notifications', () => {
        it('it should GET all the Authentication', (done) => {
            chai.request(server)
                .get('/api/user/details')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    // res.body.length.should.be.eql(2);
                    done();
                });
        });
    });


    //  * Test the /POST route *

    describe('/POST OTP', () => {
        it('it should not POST a OTP without without Provisional field', (done) => {
            let station = {
                stn: "SANTRAGACHI JN",
                stnCode: "SRC"
            }
            chai.request(server)
                .post('/api/stations1')
                .send(station)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('stnCode');
                    done();
                });
        });

        //  * Test the /POST route  With All Filelds

        describe('/POST OTP', () => {
            it('it should  POST a OTP ', (done) => {
                let station = {
                    stn: "SANTRAGACHI JN",
                    stnCode: "SRC"
                }
                chai.request(server)
                    .post('/api/stations1')
                    .send(station)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('stnCode');
                        res.body.should.have.property('stn');

                        done();
                    });
            });
        });
        // * Test the /GET/:id route
        describe('/GET:id OTP', () => {
            it('it should GET  a OTPby the given id ', (done) => {
                let station = new Stations({
                    stn: "SANTRAGACHI JN",
                    stnCode: "SRC"
                })
                station.save((err, station) => {
                    chai.request(server)
                        .get('/api/stations1/' + station.id)
                        .send(station)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.should.have.property('stnCode');
                            res.body.should.have.property('stn');
                            res.body.should.have.property('_id').eql(station.id);
                            done();

                        });
                });
            });
        });

        // * Test the /PUT/:id route
        describe('/PUT:id OTP', () => {
            it('it should  UPDATE a OTP given the id', (done) => {
                let station = new Stations({
                    stn: "SANTRAGACHI JN",
                    stnCode: "SRC"

                })
                station.save((err, station) => {
                    chai.request(server)
                        .put('/api/stations1/' + station.id)
                        .send({
                            stn: "STATANAGAR JN",
                            stnCode: "JSR"
                        })
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.should.have.property('stnCode');
                            res.body.should.have.property('stn');
                            res.body.should.have.property('stnCode').eql("JSR");
                            done();

                        });
                });
            });
        });
    });

    // * Test the /DELETE/:id route

    describe('/DELETE:id OTP', () => {
        it('it should  DELETE a OTP given the id ', (done) => {
            let station = new Stations({
                stn: "SANTRAGACHI JN",
                stnCode: "SRC"

            })
            station.save((err, station) => {
                chai.request(server)
                    .delete('/api/stations1/' + station.id)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('stnCode');
                        res.body.should.have.property('stn');
                        // res.body.should.have.property('ok').eql(1);
                        // res.body.should.have.property('n').eql(1);
                        done();

                    });
            });
        })
    });
});