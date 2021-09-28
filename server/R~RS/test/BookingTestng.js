process.env.NODE_ENV = 'test';
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
const should = chai.should();
chai.should();


chai.use(chaiHttp)

// ******** Testing begins Here ******** //

describe('Booking', () => {
    // beforeEach((done) => { //Before each test we empty the database
    //     Stations.remove({}, (err) => {
    //         done();
    //     });
    // });

    //  * Test the /GET route *

    describe('GET Booking', () => {
        it('it should GET all the Bookings', (done) => {
            chai.request(server)
                .get('/api/booking/history')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    // res.body.length.should.be.eql(12);
                    done();
                });
        });
    });


    //  * Test the /POST route *

    describe('/POST Booking', () => {
        it('it should not POST a Booking without without Provisional field', (done) => {
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

        describe('/POST Booking', () => {
            it('it should  POST a Booking ', (done) => {
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
        describe('/GET:id Booking', () => {
            it('it should GET  a Bookingby the given id ', (done) => {
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
        describe('/PUT:id Booking', () => {
            it('it should  UPDATE a Booking given the id', (done) => {
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

    describe('/DELETE:id Booking', () => {
        it('it should  DELETE a Booking given the id ', (done) => {
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