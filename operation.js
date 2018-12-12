const Organization = require('./organization.js');

/**
 * [generateOperationSets description]
 * @param  {[type]} numbers    [description]
 * @param  {[type]} operations [description]
 * @return {[type]}            [description]
 */
exports.generate = function(numbers, operations) {
  const operation_size = operations.length
  const operations_per_equation = numbers.length - 1;
  const total_operations = Math.pow(operation_size, operations_per_equation);

  let operation_sets = [];

  for (let i = 0; i < total_operations; i ++) {
    let operation_set = [];

    for (let j = 0; j < operations_per_equation; j ++) {
      operation_set.push(operations[Math.floor(i / Math.pow(operation_size, j)) % operation_size]);
    }

    operation_sets.push(operation_set);
  }

  return operation_sets;
}

/**
 * Applies the operation set to the equation.
 * 
 * @param  {string} equation     A string representing the equation
 * @param  {array}  operation_set An array of the operations that need to be placed in order.
 * @return {string}              The equation with the operations inserted.
 */
exports.apply = function(equation, operation_set) {

  for (operation in operation_set) {
    equation = equation.replace(Organization.OPERATION_KEY, operation_set[operation]);
  }

  return equation;
}