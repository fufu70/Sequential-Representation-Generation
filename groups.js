const Organize = require('./organize.js');

const OPERATION_KEY = 'O';
const JOIN_NUMBERS = `) ${OPERATION_KEY} (`;
const NUMBER_KEY = 'N';

exports.OPERATION_KEY = OPERATION_KEY;
exports.JOIN_NUMBERS = JOIN_NUMBERS;
exports.NUMBER_KEY = NUMBER_KEY;

exports.generate = function (number) {
  let groups = {};
  for (let i = 2; i <= number; i ++) {
    groups[i] = Organize.generate(i);
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