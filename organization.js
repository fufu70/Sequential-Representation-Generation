const Organize = require('./organize.js');

const OPERATION_KEY = 'O';
const JOIN_NUMBERS = `) ${OPERATION_KEY} (`;
const NUMBER_KEY = 'N';

exports.OPERATION_KEY = OPERATION_KEY;
exports.JOIN_NUMBERS = JOIN_NUMBERS;
exports.NUMBER_KEY = NUMBER_KEY;

function generateStringOrganizationSet(sizeStringOrganizationSet) {
  let stringOrganizationSet = {};
  let sizeIndex = 0;

  for (sizeIndex in sizeStringOrganizationSet) {
    let stringOrganization = sizeStringOrganizationSet[sizeIndex];
    stringOrganizationSet[sizeIndex] = [];

    for (let i = 0; i < stringOrganization.length; i ++ ) {
      let str = stringOrganization[i];

      if (sizeIndex == 2) {
        stringOrganizationSet[sizeIndex].push(str.replace(/1/g, NUMBER_KEY));
      } else {
        // go through all potential numbers in the string at this point
        for (let searchableValue = stringOrganization.length - 1; searchableValue > 1; searchableValue --) {
          // if this equation has this value lets add more values to it.
          // saGrpEqIndex == Searchable Group Equation Index
          if (str.indexOf(searchableValue) !== -1) {
            let searchableEquations = stringOrganizationSet[searchableValue];
            for (let saGrpEqIndex in searchableEquations) {
              let newStr = str.replace(new RegExp(searchableValue, "g"), searchableEquations[saGrpEqIndex]);
              newStr = newStr.replace(/1/g, NUMBER_KEY);

              stringOrganizationSet[sizeIndex].push(newStr);
            } 
          } else {
            stringOrganizationSet[sizeIndex].push(str.replace(/1/g, NUMBER_KEY));
          }
        }
      }
    }

    stringOrganizationSet[sizeIndex] = stringOrganizationSet[sizeIndex].filter(function(equation, index, stringOrganizationSet) {
      return !(/\d/g.test(equation));
    }).filter(function (equation, index, equations) {
      return equations.lastIndexOf(equation) === index;
    });
  }

  return stringOrganizationSet[sizeIndex];
}

function generateSizeOrganizationSets(number) {
  let sizeOrganizationSets = {};
  for (let i = 2; i <= number; i ++) {
    sizeOrganizationSets[i] = Organize.generate(i);
  }

  return sizeOrganizationSets;
};

function stringify(sizeOrganizationSets) {
  let sizeStringOrganizationSet = {};

  for (let sizeIndex in sizeOrganizationSets) {
    let group = sizeOrganizationSets[sizeIndex];
    sizeStringOrganizationSet[sizeIndex] = [];

    for (let equationIndex = 0; equationIndex < group.length; equationIndex ++ ) {
      sizeStringOrganizationSet[sizeIndex].push(`(${group[equationIndex].join(JOIN_NUMBERS)})`);
    }
  }

  return generateStringOrganizationSet(sizeStringOrganizationSet);
}


/**
 * Inserts the order of numbers into the given equation.
 * 
 * @param  {string} equation A string representing the equation
 * @param  {array}  order    An array of numbers that need to be placed in order.
 * @return {string}          The equation with the numbers inserted.
 */
function insertOrder(organization, numberSet) {

  for (number in numberSet) {
    organization = organization.replace(NUMBER_KEY, numberSet[number]);
  }

  return organization;
}

exports.generate  = function (numbers) {
  let sizeOrganizationSets = generateSizeOrganizationSets(numbers.length);
  let stringOrganizationSet = stringify(sizeOrganizationSets);
  let organizations = [];

  for (let organizationIndex in stringOrganizationSet) {
    organizations.push(insertOrder(stringOrganizationSet[organizationIndex], numbers));
  }

  return organizations;
}
