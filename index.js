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
  const operationSets = Operation.generate(numbers, operations);
  console.log("Operations Set. Size is " + operationSets.length);
  const organizationSets = Organization.generate(numbers);
  console.log("Equations Set. Size is " + organizationSets.length);
  let results = {};
  console.log("Searching for equations equal to " + value);

  for (let operationSetIndex = 0; operationSetIndex < operationSets.length; operationSetIndex ++) {
    for (let shiftEquationIndex = 0; shiftEquationIndex < organizationSets.length; shiftEquationIndex ++) {
      let organization = organizationSets[shiftEquationIndex];
      let operationSet = operationSets[operationSetIndex];
      let tempEquation = Operation.apply(organization, operationSet);
      let parser = new Parser();
      let expr = parser.parse(tempEquation);
      let result = expr.evaluate();

      if (isInt(result) && ((value !== undefined && result == value) || value == undefined)) {
        console.log(tempEquation);
        if (results[result] === undefined) {
          results[result] = [tempEquation];
        } else {
          results[result].push(tempEquation);
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
      let indexResults = "";
      for (let equationIndex in results[index]) {
        indexResults += index + ',' + results[index][equationIndex] + "\n";
      }

      fs.appendFileSync('./results.csv', indexResults);
    }
  });
}

saveResults(getResults(
  (process.argv[3] != undefined) ? eval(process.argv[3]) : numbers,
  (process.argv[4] != undefined) ? eval(process.argv[4]) : operations,
  (process.argv[2] == "*") ? undefined : process.argv[2]
));