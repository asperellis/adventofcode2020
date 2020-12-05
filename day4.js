const readInput = require('./utils/readInput');

readInput(4, data => {
  // passport constants
  const PASSPORT_ENTRIES = {
    'byr': 'byr',
    'cid': 'cid',
    'ecl': 'ecl',
    'eyr': 'eyr',
    'hcl': 'hcl',
    'hgt': 'hgt',
    'iyr': 'iyr',
    'pid': 'pid'
  }
  const PASSPORT_ENTRIES_TO_IGNORE = {
    [PASSPORT_ENTRIES.cid]: PASSPORT_ENTRIES.cid
  }
  const EYE_COLORS = ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'];
  const MEASUREMENT_UNITS = {
    'cm': 'cm',
    'in': 'in'
  };

  // common validation helpers
  const isInRange = (value, min, max) => value >= min && value <= max;
  const isLongEnough = (str, length) => str && str.length === length;
  const isHex = (hcl) => /^#[0-9a-fA-F]+$/.test(hcl);

  // validation by measurement unit
  const MEASUREMENT_UNIT_VALIDATORS = {
    [MEASUREMENT_UNITS.cm]: (heightValue) => !isNaN(Number(heightValue)) && isInRange(Number(heightValue), 150, 193),
    [MEASUREMENT_UNITS.in]: (heightValue) => !isNaN(Number(heightValue)) && isInRange(Number(heightValue), 59, 76)
  };

  // passport validation
  const PASSPORT_VALIDATORS = {
    byr: byr => isLongEnough(byr, 4) && isInRange(Number(byr), 1920, 2002),
    ecl: ecl => EYE_COLORS.includes(ecl),
    eyr: eyr => isLongEnough(eyr, 4) && isInRange(Number(eyr), 2020, 2030),
    hcl: hcl => isLongEnough(hcl, 7) && isHex(hcl),
    hgt: (hgt = '') => MEASUREMENT_UNIT_VALIDATORS[MEASUREMENT_UNITS[hgt.slice(-2)]]
      && MEASUREMENT_UNIT_VALIDATORS[MEASUREMENT_UNITS[hgt.slice(-2)]](hgt.slice(0,-2)),
    iyr: iyr => isLongEnough(iyr, 4) && isInRange(Number(iyr), 2010, 2020),
    pid: pid => isLongEnough(pid, 9)
  };

  /*
   * Returns if a passport object is valid, ignores cid property
   * param: passport: Object entries to validate passport
   * param: strictMode: boolean should use validators if true, checks for existence if false
   */
  const isPassportValid = (passport = {}, strictMode = false) => {
    const {byr, /* cid can be missing */ ecl, eyr, hcl, hgt, iyr, pid} = passport;
    let isValid = Boolean(byr && ecl && eyr && hcl && hgt && iyr && pid);

    if (strictMode && isValid) {
      for(const entry in passport) {
        if (!PASSPORT_ENTRIES_TO_IGNORE[entry] && isValid) {
          isValid = PASSPORT_VALIDATORS[entry](passport[entry]);
        }
      }
    }

    return isValid;
  };

  const parsePassport = passport => {
    const passportEntryMap = {};

    passport.split('\n').forEach(row => {
        const entries = row.split(' ');
        entries.forEach(entry => {
          const [key, value] = entry.split(':');
          passportEntryMap[key] = value;
        });
    });

    return passportEntryMap;
  };

  // puzzle input
  const passports = data.trim().split('\n\n').map(parsePassport);
  const strictMode = true;

  // PART 1 Solution
  console.log(passports.filter(passport => isPassportValid(passport, !strictMode)).length);

  // PART 2 Solution
  console.log(passports.filter(passport => isPassportValid(passport, strictMode)).length);
});
