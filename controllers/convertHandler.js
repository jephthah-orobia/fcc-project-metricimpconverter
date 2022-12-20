function ConvertHandler() {

  /* Helpers */
  const number_pattern = /^\d+(\.?(?<=\.)\d+)?(\/?(?<=\/)\d+(\.?(?<=\.)\d+)?)?$/;
  const unit_start = /[a-zA-Z]/;
  const unit_pattern = /^gal|L|mi|km|lbs|kg$/;

  const return_units = {
    'gal': { return: 'L', 'spellout': 'gallons' },
    'L': { return: 'gal', 'spellout': 'liters' },
    'km': { return: 'mi', 'spellout': 'kilometers' },
    'mi': { return: 'km', 'spellout': 'miles' },
    'lbs': { return: 'kg', 'spellout': 'pounds' },
    'kg': { return: 'lbs', 'spellout': 'kilograms' }
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
      return unit;
    else
      throw new Error("invalid unit");
  };

  this.getReturnUnit = function (initUnit) {
    return return_units[initUnit].return;
  };

  this.spellOutUnit = function (unit) {
    return return_units[unit].spellout;
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
    return round(result, 5);
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
