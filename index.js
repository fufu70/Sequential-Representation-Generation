#!/usr/bin/env node
const fs = require('fs');
const Parser = require('expr-eval').Parser;
const ProgressBar = require('progress');

const numbers = [1,2,3,4,5,6,7,8,9];
const operations = ['+', '-', '*', '^', '||'];
// const operations = ['-'];
const NUMBER_KEY = 'I';
const OPERATION_KEY = 'P';

/**
 * Sets up the grouping in an equation.
 * 
 * @param  {number} count The amount of numbers in the equation
 * @param  {number} shift The shift from left to right.
 * @return {string}       The equation.
 */
function generateEquation(count, shift) {

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

    return ` ( ${ generateEquation(left, shift) } ) ${ OPERATION_KEY } ( ${ generateEquation(right, shift) } ) `;
  }
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
  let equations = [];

  for (let shift = 1; shift < count; shift ++) {
    equations.push(
      insertOrder(
        generateEquation(count, shift), 
        numbers
      )
    );
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

saveResults(getResults(numbers, operations, process.argv[2]));