
const OPERATION_KEY = 'O';
const JOIN_NUMBERS = `) ${OPERATION_KEY} (`;
const NUMBER_KEY = 'N';

exports.OPERATION_KEY = OPERATION_KEY;
exports.JOIN_NUMBERS = JOIN_NUMBERS;
exports.NUMBER_KEY = NUMBER_KEY;

function addToGroup(equation, group) {
  for (var i = 0; i < group.length; i ++) {
    if (group[i].toString() == equation.toString()) {
      return group;
    }
  }

  group.push(equation.slice(0));

  return group;
}


function addGroupNumberEquations(equation, group) {
  if (equation.length != 1) {
    if (equation[0] == 1) {
      group = addToGroup(equation.slice(0), group);
    } else {
      for (let i = 0; i < equation.length; i ++) {
        equation.push(equation.shift())
        group = addToGroup(equation.slice(0), group);
      }   
    }
  }

  return group;
}

function shiftThrough(equation, group) {
  let pointer = 0;

  group = addGroupNumberEquations(equation.slice(0), group);

  for (let pointer = 1; pointer < equation.length; pointer ++) {

    equation[pointer - 1] --;
    equation[pointer] ++;

    if (equation.indexOf(0) == -1) {
      group = addGroupNumberEquations(equation.slice(0), group);
    }
  }

  return group;
}

function createGroupNumber(number) {
  let equation = [number];
  let pointer = 0;
  let group = [];

  do {
    if ((equation[pointer] > 1 && pointer == equation.length - 1) || equation[pointer] == 2) {
      equation.push(1);
      equation[pointer] --;

      shiftThrough(equation.slice(0), group);
    } else if (equation[pointer] > 1 && pointer < equation.length - 1) {
      equation[pointer + 1] ++;
      equation[pointer] --;

      if (equation[pointer] - equation[pointer + 1] <= 1) {
        pointer ++;
      }

      shiftThrough(equation.slice(0), group);
    } else {
      pointer --;
    }
  } while (equation[0] != 1)

  return group;
}

exports.generate = function (number) {
  let groups = {};
  for (let i = 2; i <= number; i ++) {
    groups[i] = createGroupNumber(i);
  }

  return groups;
};

exports.stringify = function(groups) {
  let strGroups = {};

  for (let groupIndex in groups) {
    let group = groups[groupIndex];
    strGroups[groupIndex] = [];

    for (let equationIndex = 0; equationIndex < group.length; equationIndex ++ ) {
      strGroups[groupIndex].push(`(${group[equationIndex].join(JOIN_NUMBERS)})`);
    }
  }

  return strGroups;
}