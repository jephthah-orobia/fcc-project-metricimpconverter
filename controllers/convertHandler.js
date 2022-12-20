function ConvertHandler() {

  /* Helpers */
  const number_pattern = /^\d+(\.?(?<=\.)\d+)?(\/?(?<=\/)\d+(\.?(?<=\.)\d+)?)?$/;
  const unit_start = /[a-z]/i;
  const unit_pattern = /^(gal|L|mi|km|lbs|kg)$/i;
  const liter_pattern = /^l$/i;
  const return_units = {
    'gal': { toReturn: 'L', 'spellout': 'gallons' },
    'l': { toReturn: 'gal', 'spellout': 'liters' },
    'km': { toReturn: 'mi', 'spellout': 'kilometers' },
    'mi': { toReturn: 'km', 'spellout': 'miles' },
    'lbs': { toReturn: 'kg', 'spellout': 'pounds' },
    'kg': { toReturn: 'lbs', 'spellout': 'kilograms' }
  };

  const round = (n, p) => Math.round(n * Math.pow(10, p)) / Math.pow(10, p);

  const split = (input) => {
    const i = input.indexOf(input.match(unit_start));
    return [input.substring(0, i), input.substring(i)];
  };

  /* Public functions */
  this.getNum = function (input) {
    const [num, unit] = split(input);
    if (num.length == 0)
      return 1;
    else if (number_pattern.test(num))
      return eval(num);
    else
      throw new Error("invalid number");
  };

  this.getUnit = function (input) {
    const [num, unit] = split(input);
    if (unit_pattern.test(unit))
      return liter_pattern.test(unit) ? 'L' : unit.toLowerCase();
    else
      throw new Error("invalid unit");
  };

  this.getReturnUnit = function (initUnit) {
    let result = return_units[initUnit.toLowerCase()].toReturn;
    return liter_pattern.test(result)
      ? 'L' : result.toLowerCase();
  };

  this.spellOutUnit = function (unit) {
    return return_units[unit.toLowerCase()].spellout;
  };

  this.convert = function (initNum, initUnit) {
    const galToL = 3.78541;
    const lbsToKg = 0.453592;
    const miToKm = 1.60934;
    let result;
    switch (initUnit) {
      case 'gal':
        result = initNum * galToL;
        break;
      case 'L':
        result = initNum / galToL;
        break;
      case 'mi':
        result = initNum * miToKm;
        break;
      case 'km':
        result = initNum / miToKm;
        break;
      case 'lbs':
        result = initNum * lbsToKg;
        break;
      case 'kg':
        result = initNum / lbsToKg;
        break;
      default:
        throw new Error("invalid unit");
    }
    result = Number.isInteger(result) ? parseInt(result) : round(result, 5);
    return result;
  };

  this.getString = function (initNum, initUnit, returnNum, returnUnit) {
    try {
      return initNum + ' ' + initUnit + ' converts to '
        + returnNum + ' ' + returnUnit;
    } catch (e) {
      throw e;
    }
  };

}

module.exports = ConvertHandler;
