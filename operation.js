const Organization = require('./organization.js');

/**
 * [generateOperationSets description]
 * @param  {[type]} numbers    [description]
 * @param  {[type]} operations [description]
 * @return {[type]}            [description]
 */
exports.generate = function(numbers, operations) {
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
exports.apply = function(equation, operationSet) {

  for (operation in operationSet) {
    equation = equation.replace(Organization.OPERATION_KEY, operationSet[operation]);
  }

  return equation;
}