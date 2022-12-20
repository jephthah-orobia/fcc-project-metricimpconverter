const { expect, assert } = require('chai');
const ConvertHandler = require('../controllers/convertHandler.js');

let convertHandler = new ConvertHandler();

suite('Unit Tests', function () {
    const getNum = convertHandler.getNum;
    suite('Number Handling',
        function () {
            test('test output type', function (done) {
                expect(getNum).to.be.a('function');
                expect(getNum('12gal')).to.be.a('number');
                expect(getNum('1.3/2.3L')).to.be.an('number');
                expect(getNum('1.3/2.3')).to.be.a('number');
                expect(getNum('1.3/23')).to.be.a('number');
                expect(() => getNum('12 gal')).to.throw("invalid number");
                expect(() => getNum('1/2/3gal')).to.throw("invalid number");
                done();
            });

            test('should correctly read a whole number input', function (done) {
                assert.equal(getNum('235km'), 235);
                assert.equal(getNum('2km'), 2);
                assert.equal(getNum('10km'), 10);
                expect(() => getNum('-10km')).to.throw("invalid number");
                done();
            });

            test('should correctly read a decimal number input', function (done) {
                assert.equal(getNum('2.35km'), 2.35);
                assert.equal(getNum('2.35gal'), 2.35);
                assert.equal(getNum('2.35L'), 2.35);
                assert.equal(getNum('2.35lbs'), 2.35);
                assert.equal(getNum('2.35mi'), 2.35);
                assert.equal(getNum('2.0km'), 2.0);
                assert.equal(getNum('0.10km'), 0.1);
                expect(() => getNum('2.3.5km')).to.throw("invalid number");
                done();
            });

            test('should correctly read a fraction input', function (done) {
                assert.equal(getNum('23/5km'), 23 / 5);
                assert.equal(getNum('23/5gal'), 23 / 5);
                assert.equal(getNum('23/5L'), 23 / 5);
                assert.equal(getNum('2/1km'), 2);
                assert.equal(getNum('8/10km'), 8 / 10);
                expect(() => getNum('-1/12km')).to.throw("invalid number");
                done();
            });

            test('should correctly read a fraction input with a decimal', function (done) {
                assert.equal(getNum('2.3/5km'), 2.3 / 5);
                assert.equal(getNum('2.3/5gal'), 2.3 / 5);
                assert.equal(getNum('2/3.5L'), 2 / 3.5);
                assert.equal(getNum('2.5/1.5km'), 2.5 / 1.5);
                assert.equal(getNum('8.2/1.0km'), 8.2);
                expect(() => getNum('-1.2/1.2km')).to.throw("invalid number");
                done();
            });

            test('should correctly return an error on a double-fraction', function (done) {
                expect(() => getNum('3/2/3gal')).to.throw("invalid number");
                expect(() => getNum('1/2/3L')).to.throw("invalid number");
                expect(() => getNum('1/2.2/3L')).to.throw("invalid number");
                expect(() => getNum('1.2/2.2/3km')).to.throw("invalid number");
                expect(() => getNum('1.2/2.2/1km')).to.throw("invalid number");
                done();
            });

            test('should correctly default to a numerical input of 1 when no numerical input is provided', function (done) {
                assert.equal(getNum('gal'), 1);
                assert.equal(getNum('L'), 1);
                assert.equal(getNum('mi'), 1);
                assert.equal(getNum('km'), 1);
                assert.equal(getNum('lbs'), 1);
                assert.equal(getNum('kg'), 1);
                done();
            });

        });

    suite('Units handling', function () {
        let valid_units = ['gal', 'L', 'km', 'mi', 'lbs', 'kg'];

        let return_units = {
            'gal': 'L', 'L': 'gal', 'km': 'mi', 'mi': 'km', 'lbs': 'kg', 'kg': 'lbs'
        }
        let valid_nums = ['', '3', '32', '12', '1.3', '0.5', '23.485', '1/2', '1/4', '2/5', '2.65/5', '32.12/321.12', '321/1.23'];

        const { getUnit, getReturnUnit, spellOutUnit } = convertHandler;

        test('should correctly read each valid input unit', function (done) {
            for (let unit of valid_units)
                for (let num of valid_nums)
                    assert.equal(getUnit(num + unit), unit, "test for " + num + unit);
            done();
        });

        test('should correctly return an error for an invalid input unit', function (done) {
            expect(() => getUnit('3.2cm')).to.throw();
            expect(() => getUnit('3/2 in')).to.throw();
            expect(() => getUnit('3.2')).to.throw();
            expect(() => getUnit('3.2/l')).to.throw();
            expect(() => getUnit('3.2 grams')).to.throw();
            done();
        });

        test('should return the correct return unit for each valid input unit', function (done) {
            assert.equal(getReturnUnit('gal'), 'L');
            assert.equal(getReturnUnit('L'), 'gal');
            assert.equal(getReturnUnit('km'), 'mi');
            assert.equal(getReturnUnit('mi'), 'km');
            assert.equal(getReturnUnit('lbs'), 'kg');
            assert.equal(getReturnUnit('kg'), 'lbs');
            done();
        });

        test('should correctly return the spelled-out string unit for each valid input', function (done) {
            assert.equal(spellOutUnit('gal'), 'gallons');
            assert.equal(spellOutUnit('km'), 'kilometers');
            assert.equal(spellOutUnit('L'), 'liters');
            assert.equal(spellOutUnit('mi'), 'miles');
            assert.equal(spellOutUnit('lbs'), 'pounds');
            assert.equal(spellOutUnit('kg'), 'kilograms');
            done();
        });

    });

    suite('Conversion', function () {
        const { convert } = convertHandler;

        test('should correctly convert gal to L', function (done) {
            assert.equal(convert(1, 'gal'), 3.78541);
            assert.equal(convert(1.5, 'gal'), 5.67812);
            assert.equal(convert(0.0005, 'gal'), 0.00189);
            assert.equal(convert(1 / 3, 'gal'), 1.2618);
            assert.equal(convert(3500, 'gal'), 13248.935);
            done();
        });

        test('should correctly convert L to gal', function (done) {
            assert.equal(convert(1, 'L'), 0.26417);
            assert.equal(convert(8, 'L'), 2.11338);
            assert.equal(convert(0.5, 'L'), 0.13209);
            assert.approximately(convert(1 / 3, 'L'), 0.08806, 0.00001);
            assert.equal(convert(4500, 'L'), 1188.7748);
            done();
        });

        test('should correctly convert mi to km', function (done) {
            assert.equal(convert(1, 'mi'), 1.60934);
            assert.equal(convert(9, 'mi'), 14.48406);
            assert.equal(convert(0.5, 'mi'), 0.80467);
            assert.equal(convert(1 / 3, 'mi'), 0.53645);
            assert.equal(convert(0.00225, 'mi'), 0.00362);
            assert.equal(convert(1.1 / 2.3, 'mi'), 0.76968);
            assert.equal(convert(1024, 'mi'), 1647.96416);
            done();
        });

        test('should correctly convert km to mi', function (done) {
            assert.equal(convert(1.60934, 'km'), 1);
            assert.equal(convert(1, 'km'), 0.62137);
            assert.equal(convert(9, 'km'), 5.59235);
            assert.equal(convert(0.5, 'km'), 0.31069);
            assert.equal(convert(1 / 3, 'km'), 0.20712);
            assert.equal(convert(0.00225, 'km'), 0.00140);
            assert.equal(convert(1.1 / 2.3, 'km'), 0.29718);
            assert.equal(convert(1024, 'km'), 636.28568);
            done();
        });

        test('should correctly convert lbs to kg', function (done) {
            assert.equal(convert(1, 'kg'), 2.20462);
            assert.equal(convert(9, 'kg'), 19.84162);
            assert.equal(convert(0.5, 'kg'), 1.10231);
            assert.equal(convert(1 / 3, 'kg'), 0.73487);
            assert.equal(convert(0.00225, 'kg'), 0.00496);
            assert.equal(convert(1.1 / 2.3, 'kg'), 1.05439);
            assert.equal(convert(1024, 'kg'), 2257.53541);
            done();
        });

        test('should correctly convert kg to lbs', function (done) {
            assert.equal(convert(1, 'lbs'), 0.45359);
            assert.equal(convert(9, 'lbs'), 4.08233);
            assert.equal(convert(0.5, 'lbs'), 0.22680);
            assert.equal(convert(1 / 3, 'lbs'), 0.15120);
            assert.equal(convert(0.00225, 'lbs'), 0.00102);
            assert.equal(convert(1.1 / 2.3, 'lbs'), 0.21694);
            assert.equal(convert(1024, 'lbs'), 464.47821);
            done();
        });
    });

});