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
exports.apply = function(equation, operation_outer_set, operation_inner_set) {
  for (operation_outer in operation_outer_set) {
    for (operation_inner in operation_inner_set) {
      equation = equation.replace(Organization.INNER_OPERATION_KEY, operation_inner_set[operation_inner]);
      equation = equation.replace(Organization.OUTER_OPERATION_KEY, operation_outer_set[operation_outer]);
    }
  }

  return equation;
}

const INNER_OPERATIONS = ['', '!', '%']

function isInnerOperation(func) {
  return INNER_OPERATIONS.indexOf(func) != -1;
}