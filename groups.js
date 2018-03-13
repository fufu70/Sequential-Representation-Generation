
let groups = {}; // all of the groups that can exist from 1 to n size equations
let size = 6;

function addGroupNumberEquations(equation, number) {
  if (equation.length != 1) {
    if (equation[0] == 1) {
      groups[number].push(equation.slice(0));
    } else {
      for (let i = 0; i < equation.length; i ++) {
        equation.push(equation.shift())
        groups[number].push(equation.slice(0));
      }   
    }
  }
}

function shiftThrough(equation, number) {
  let pointer = 0;

  addGroupNumberEquations(equation.slice(0), number);

  for (let pointer = 1; pointer < equation.length; pointer ++) {

    equation[pointer - 1] --;
    equation[pointer] ++;

    if (equation.indexOf(0) == -1) {
      addGroupNumberEquations(equation.slice(0), number);
    }
  }
}

function createGroupNumber(number) {
  let equation = [number];
  let pointer = 0;

  groups[number] = [];

  do {
    if ((equation[pointer] > 1 && pointer == equation.length - 1) || equation[pointer] == 2) {
      equation.push(1);
      equation[pointer] --;

      shiftThrough(equation.slice(0), number);
    } else if (equation[pointer] > 1 && pointer < equation.length - 1) {
      equation[pointer + 1] ++;
      equation[pointer] --;

      if (equation[pointer] - equation[pointer + 1] <= 1) {
        pointer ++;
      }

      shiftThrough(equation.slice(0), number);
    } else {
      pointer --;
    }
  } while (equation[0] != 1)
}

function filterGroupNumber(number) {
  let equationStrings = groups[number].map(function(equation) {
    return equation.join(",");
  });

  equationStrings = equationStrings.filter(function (equation, index, equationStrings) {
    return equationStrings.lastIndexOf(equation) === index;
  });

  groups[number] = equationStrings.map(function(equationString) {
    return equationString.split(",").map(function(number) {
      return parseInt(number);
    });
  });
}

exports.generate = function (number) {
  for (let i = 2; i <= number; i ++) {
    createGroupNumber(i);
    filterGroupNumber(i);
  }

  return groups;
};