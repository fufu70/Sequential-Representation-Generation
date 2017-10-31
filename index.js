#!/usr/bin/env node
const binetree = require('./binary_tree.js');
const Equation = require('./node_modules/equations/equation.js').default;

const numbers = [1,2,3,4,5,6,7,8,9];
// const operations = ['+', '-', '*', '^'];
const operations = ['-'];
const NUMBER_KEY = 'I';
const OPERATION_KEY = 'P';

// let tree = binetree('(1 + 2 + 3 + 5) * 6');

// console.log(tree);

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

const operationSets = generateOperationSets(numbers, operations);

const shiftEquations = generateShiftEquations(numbers);

let tempEquation = applyOperation(shiftEquations[3], operationSets[0]);
// let tree = binetree(tempEquation);
console.log(tempEquation);
// console.log(tempEquation + ' = ' + tree.result);
console.log(tempEquation + ' = ' + Equation.solve(tempEquation));
// console.log(typeof Equation.default.solve);