#!/usr/bin/env node
const fs = require('fs');
const Parser = require('expr-eval').Parser;
const Groups = require('./groups.js');

const numbers = [1,2,3,4,5,6,7,8,9];
// const numbers = [1,2,3,4,5];
const operations = ['+', '-', '*', '^', '||'];
const NUMBER_KEY = 'I';
const OPERATION_KEY = 'P';

/**
 * Sets up the grouping in an equation.
 * 
 * @param  {number} count The amount of numbers in the equation
 * @param  {number} shift The shift from left to right.
 * @param  {number} depth How many groups are suppose to exist.
 * @return {string}       The equation.
 */
function generateEquation(count, shift, depth) {

  if (depth == 0) {
    let group = [];
    for (let i = 0; i < count; i ++) {
      group.push(NUMBER_KEY);
    } 
    return group.join(` ${ OPERATION_KEY } `);
  }

  if (count == 1) {
    return NUMBER_KEY;
  } else if (count == 2) {
    return `${ NUMBER_KEY } ${ OPERATION_KEY } ${ NUMBER_KEY }`;
  } else {
    if (shift >= count) {
      shift = count - 1;
    }

    let left = Math.round(count * (shift / count));
    let right = Math.round(count * (1 - (shift / count)));

    return ` ( ${ generateEquation(left, shift, depth - 1) } ) ${ OPERATION_KEY } ( ${ generateEquation(right, shift, depth - 1) } ) `;
  }
}

function generateGroupEquation(numbers) {
  let groups = Groups.generate(numbers.length);
  let joinNumbers = `) ${OPERATION_KEY} (`;
  let strGroups = {};

  for (let groupIndex in groups) {
    let group = groups[groupIndex];
    strGroups[groupIndex] = [];

    for (let equationIndex = 0; equationIndex < group.length; equationIndex ++ ) {
      strGroups[groupIndex].push(`(${group[equationIndex].join(joinNumbers)})`);
    }
  }

  let newStrGroups = {};

  for (let groupIndex in strGroups) {
    let group = strGroups[groupIndex];
    let currentValue = parseInt(groupIndex);
    newStrGroups[groupIndex] = [];

    for (let equationIndex = 0; equationIndex < group.length; equationIndex ++ ) {
      let str = group[equationIndex];

      if (groupIndex == 2) {
        newStrGroups[groupIndex].push(str.replace(/1/g, NUMBER_KEY));
      } else {
        // go through all potential numbers in the string at this point
        for (let searchableValue = group.length - 1; searchableValue > 1; searchableValue --) {
          // if this equation has this value lets add more values to it.
          // saGrpEqIndex == Searchable Group Equation Index
          if (str.indexOf(searchableValue) !== -1) {
            let searchableEquations = newStrGroups[searchableValue];
            for (let saGrpEqIndex in newStrGroups[searchableValue]) {
              let newStr = str.replace(new RegExp(searchableValue, "g"), searchableEquations[saGrpEqIndex]);
              newStr = newStr.replace(/1/g, NUMBER_KEY);

              newStrGroups[groupIndex].push(newStr);
            } 
          } else {
            newStrGroups[groupIndex].push(str.replace(/1/g, NUMBER_KEY));
          }
        }
      }
    }

    newStrGroups[groupIndex] = newStrGroups[groupIndex].filter(function(equation, index, newStrGroups) {
      return !(/\d/g.test(equation));
    }).filter(function (equation, index, equations) {
      return equations.lastIndexOf(equation) === index;
    });;
  }

  return newStrGroups[numbers.length];
}

/**
 * Inserts the order of numbers into the given equation.
 * 
 * @param  {string} equation A string representing the equation
 * @param  {array}  order    An array of numbers that need to be placed in order.
 * @return {string}          The equation with the numbers inserted.
 */
function insertOrder(equation, order) {

  for (number in order) {
    equation = equation.replace(NUMBER_KEY, order[number]);
  }

  return equation;
}

/**
 * [renderShiftEquations description]
 * 
 * @param  {array} numbers All of the numbers that will apply 
 * @return {array}         All of the resulting Shift equations
 */
function generateShiftEquations(numbers) {
  
  const count = numbers.length;
  let group = generateGroupEquation(numbers);
  let equations = [];
  let lastEquationLength = 0;
  let depth = 0;

  for (let equationIndex in group) {
    equations.push(insertOrder(group[equationIndex], numbers));
  }

  return equations;
}

/**
 * [generateOperationSets description]
 * @param  {[type]} numbers    [description]
 * @param  {[type]} operations [description]
 * @return {[type]}            [description]
 */
function generateOperationSets(numbers, operations) {
  const operationSize = operations.length
  const operationsPerEquation = numbers.length - 1;
  const totalOperations = Math.pow(operationSize, operationsPerEquation);

  let operationSets = [];

  for (let i = 0; i < totalOperations; i ++) {
    let operationSet = [];

    for (let j = 0; j < operationsPerEquation; j ++) {
      operationSet.push(operations[Math.floor(i / Math.pow(operationSize, j)) % operationSize]);
    }

    operationSets.push(operationSet);
  }

  return operationSets;

}

/**
 * Applies the operation set to the equation.
 * 
 * @param  {string} equation     A string representing the equation
 * @param  {array}  operationSet An array of the operations that need to be placed in order.
 * @return {string}              The equation with the operations inserted.
 */
function applyOperation(equation, operationSet) {

  for (operation in operationSet) {
    equation = equation.replace(OPERATION_KEY, operationSet[operation]);
  }

  return equation;
}

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
  const operationSets = generateOperationSets(numbers, operations);
  const shiftEquations = generateShiftEquations(numbers);
  let results = [];

  // Save all of the potential equations and operations
  for (let operationSetIndex = 0; operationSetIndex < operationSets.length; operationSetIndex ++) {
    for (let shiftEquationIndex = 0; shiftEquationIndex < shiftEquations.length; shiftEquationIndex ++) {
      let shiftEquation = shiftEquations[shiftEquationIndex];
      let operationSet = operationSets[operationSetIndex];
      let tempEquation = applyOperation(shiftEquation, operationSet);
      let parser = new Parser();
      let expr = parser.parse(tempEquation);
      let result = parseInt(expr.evaluate());

      if (result >= 0 && result <= 11111 && isInt(result) &&
        ((value !== undefined && result == value) || value == undefined)) {
        if (results[result] === undefined) {
          results[result] = [];
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

  fs.writeFile('./results.csv', 'result,equation\n');
  for (let index in results) {
    let indexResults = "";
    for (let equationIndex in results[index]) {
      indexResults += index + ',' + results[index][equationIndex] + "\n";
    }
    fs.appendFile('./results.csv', indexResults);
  }
}

saveResults(getResults(
  (process.argv[3] != undefined) ? eval(process.argv[3]) : numbers,
  (process.argv[4] != undefined) ? eval(process.argv[4]) : operations,
  (process.argv[2] == "*") ? undefined : process.argv[2]
));