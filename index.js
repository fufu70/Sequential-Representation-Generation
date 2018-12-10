#!/usr/bin/env node
const fs = require('fs');
const Parser = require('expr-eval').Parser;
const Organization = require('./organization.js');
const Operation = require('./operation.js');

const numbers = [1,2,3,4,5,6,7,8,9];
const operations = ['+', '-', '*', '^', '||'];

// Short-circuiting, and saving a parse operation
function isInt(value) {
  var x;
  if (isNaN(value)) {
    return false;
  }
  x = parseFloat(value);
  return (x | 0) === x;
}

/**
 * Gets all of the results with the provided numbers, operations and seeked value. 
 * If no value is provided then the method will get all values from 0 to 11111.
 * 
 * @param  {array}  numbers    An array of all the numbers in sequential order
 * @param  {array}  operations An array of all of the operations avaiable to utilize
 * @param  {number} value      The value to search for.
 * @return {array}             An array of arrays where the index is the value and the 
 *                             index references all of the equations that equal that index
 */
function getResults(numbers, operations, value) {
  // Get all of the operations and equations
  const operation_sets = Operation.generate(numbers, operations);
  console.log("Operations _set. Size is " + operation_sets.length);
  const organization_sets = Organization.generate(numbers);
  console.log("Equations _set. Size is " + organization_sets.length);
  let results = {};
  console.log("Searching for equations equal to " + value);

  for (let operation_set_index = 0; operation_set_index < operation_sets.length; operation_set_index ++) {
    for (let organization_set_index = 0; organization_set_index < organization_sets.length; organization_set_index ++) {
      let organization = organization_sets[organization_set_index];
      let operation_set = operation_sets[operation_set_index];
      let temp_equation = Operation.apply(organization, operation_set);
      let parser = new Parser();
      let expr = parser.parse(temp_equation);
      let result = expr.evaluate();

      if (isInt(result) && ((value !== undefined && result == value) || value == undefined)) {
        console.log(temp_equation);
        if (results[result] === undefined) {
          results[result] = [temp_equation];
        } else {
          results[result].push(temp_equation);
        }
      }
    }
  }

  return results;
}

/**
 * Goes through all of the results and saves them
 * 
 * @param  {array} results The results.
 */
function saveResults(results) {
  fs.writeFile('./results.csv', 'result,equation\n', function() {
    for (let index in results) {
      let index_results = "";
      for (let equation_index in results[index]) {
        index_results += index + ',' + results[index][equation_index] + "\n";
      }

      fs.appendFileSync('./results.csv', index_results);
    }
  });
}

saveResults(getResults(
  (process.argv[3] != undefined) ? eval(process.argv[3]) : numbers,
  (process.argv[4] != undefined) ? eval(process.argv[4]) : operations,
  (process.argv[2] == "*") ? undefined : process.argv[2]
));