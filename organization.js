const Organize = require('./organize.js');

const OPERATION_KEY = 'O';
const JOIN_NUMBERS = `) ${OPERATION_KEY} (`;
const NUMBER_KEY = 'N';

exports.OPERATION_KEY = OPERATION_KEY;
exports.JOIN_NUMBERS = JOIN_NUMBERS;
exports.NUMBER_KEY = NUMBER_KEY;

function generateStringOrganizationSet(size_string_organization_set) {
  let string_organization_set = {};
  let size_index = 0;

  for (size_index in size_string_organization_set) {
    let stringOrganization = size_string_organization_set[size_index];
    string_organization_set[size_index] = [];

    for (let i = 0; i < stringOrganization.length; i ++ ) {
      let str = stringOrganization[i];

      if (size_index == 2) {
        string_organization_set[size_index].push(str.replace(/1/g, NUMBER_KEY));
      } else {
        // go through all potential numbers in the string at this point
        for (let searchableValue = stringOrganization.length - 1; searchableValue > 1; searchableValue --) {
          // if this equation has this value lets add more values to it.
          // saGrpEqIndex == Searchable Group Equation Index
          if (str.indexOf(searchableValue) !== -1) {
            let searchableEquations = string_organization_set[searchableValue];
            for (let saGrpEqIndex in searchableEquations) {
              let newStr = str.replace(new RegExp(searchableValue, "g"), searchableEquations[saGrpEqIndex]);
              newStr = newStr.replace(/1/g, NUMBER_KEY);

              string_organization_set[size_index].push(newStr);
            } 
          } else {
            string_organization_set[size_index].push(str.replace(/1/g, NUMBER_KEY));
          }
        }
      }
    }

    string_organization_set[size_index] = string_organization_set[size_index].filter(function(equation, index, string_organization_set) {
      return !(/\d/g.test(equation));
    }).filter(function (equation, index, equations) {
      return equations.lastIndexOf(equation) === index;
    });
  }

  return string_organization_set[size_index];
}

function generateSizeOrganizationSets(number) {
  let size_organization_sets = {};
  for (let i = 2; i <= number; i ++) {
    size_organization_sets[i] = Organize.generate(i);
  }

  return size_organization_sets;
};

function stringify(size_organization_sets) {
  let size_string_organization_set = {};

  for (let size_index in size_organization_sets) {
    let group = size_organization_sets[size_index];
    size_string_organization_set[size_index] = [];

    for (let equation_index = 0; equation_index < group.length; equation_index ++ ) {
      size_string_organization_set[size_index].push(`(${group[equation_index].join(JOIN_NUMBERS)})`);
    }
  }

  return generateStringOrganizationSet(size_string_organization_set);
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

exports.generate = function (numbers) {
  let size_organization_sets = generateSizeOrganizationSets(numbers.length);
  let string_organization_set = stringify(size_organization_sets);
  let organizations = [];

  for (let organization_index in string_organization_set) {
    organizations.push(insertOrder(string_organization_set[organization_index], numbers));
  }

  return organizations;
}
