'use strict';

const expect = require('chai').expect;
const ConvertHandler = require('../controllers/convertHandler.js');

module.exports = function (app) {

  let convertHandler = new ConvertHandler();


  app.get('/api/convert', (req, res) => {
    const input = req.query.input;

    let isValidNumber = true,
      isValidUnit = true,
      initNum,
      initUnit;


    try {
      initNum = convertHandler.getNum(input);
    } catch (e) {
      isValidNumber = false;
    }

    try {
      initUnit = convertHandler.getUnit(input);
    } catch (e) {
      isValidUnit = false;
    }

    if (isValidNumber && isValidUnit) {
      let returnUnit = convertHandler.getReturnUnit(initUnit);
      let returnNum = convertHandler.convert(initNum, initUnit);
      res.json({
        initNum,
        initUnit,
        returnNum,
        returnUnit,
        string: `${initNum} ${convertHandler.spellOutUnit(initUnit)} converts to ${returnNum} ${convertHandler.spellOutUnit(returnUnit)}`
      });
    }
    else if (isValidNumber && !isValidUnit)
      res.send("invalid unit");
    else if (isValidUnit && !isValidNumber)
      res.send("invalid number");
    else
      res.send("invalid number and unit");
  });

};
