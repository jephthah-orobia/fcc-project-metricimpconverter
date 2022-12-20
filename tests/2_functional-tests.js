const chaiHttp = require('chai-http');
const chai = require('chai');
let assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function () {
    suite('GET /api/convert', function () {

        test('Convert a valid input such as 10L: GET request to /api/convert', function (done) {
            chai
                .request(server)
                .get('/api/convert?input=10L')
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    let resjson;
                    assert.doesNotThrow(() => resjson = JSON.parse(res.text));
                    assert.deepPropertyVal(resjson, 'initNum', 10);
                    assert.deepPropertyVal(resjson, 'initUnit', 'L');
                    assert.deepPropertyVal(resjson, 'returnNum', 2.64172);
                    assert.deepPropertyVal(resjson, 'returnUnit', 'gal');
                    assert.deepPropertyVal(resjson, 'string', '10 liters converts to 2.64172 gallons');
                    done();
                })
        });

        test('Convert an invalid input such as 32g: GET request to /api/convert', function (done) {
            chai
                .request(server)
                .get('/api/convert?input=32g')
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    let resjson;
                    assert.Throw(() => resjson = JSON.parse(res.text));
                    assert.equal(res.text, "invalid unit");
                    done();
                })
        });

        test('Convert an invalid number such as 3/7.2/4kg: GET request to /api/convert', function (done) {
            chai
                .request(server)
                .get('/api/convert?input=3/7.2/4kg')
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    let resjson;
                    assert.Throw(() => resjson = JSON.parse(res.text));
                    assert.equal(res.text, "invalid number");
                    done();
                })
        });

        test('Convert an invalid number AND unit such as 3/7.2/4kilomegagram: GET request to /api/convert.', function (done) {
            chai
                .request(server)
                .get('/api/convert?input=3/7.2/4kilomegagram')
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    let resjson;
                    assert.Throw(() => resjson = JSON.parse(res.text));
                    assert.equal(res.text, "invalid number and unit");
                    done();
                })
        });

        test('Convert with no number such as kg', function (done) {
            chai
                .request(server)
                .get('/api/convert?input=kg')
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    let resjson;
                    assert.doesNotThrow(() => resjson = JSON.parse(res.text));
                    assert.deepPropertyVal(resjson, 'initNum', 1);
                    assert.deepPropertyVal(resjson, 'initUnit', 'kg');
                    assert.deepPropertyVal(resjson, 'returnNum', 2.20462);
                    assert.deepPropertyVal(resjson, 'returnUnit', 'lbs');
                    assert.deepPropertyVal(resjson, 'string', '1 kilograms converts to 2.20462 pounds');
                    done();
                })
        });

    });

});
