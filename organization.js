const Organize = require('./organize.js');

const OUTER_OPERATION_KEY = 'O';
const INNER_OPERATION_KEY = 'I';
const JOIN_NUMBERS = `) ${OUTER_OPERATION_KEY} (`;
const NUMBER_KEY = 'N';

exports.OUTER_OPERATION_KEY = OUTER_OPERATION_KEY;
exports.INNER_OPERATION_KEY = INNER_OPERATION_KEY;
exports.JOIN_NUMBERS = JOIN_NUMBERS;
exports.NUMBER_KEY = NUMBER_KEY;

function generateStringOrganizationSet(size_string_organization_set) {
    let string_organization_set = {};
    let size_index = 0;

    for (size_index in size_string_organization_set) {
        let string_organization = size_string_organization_set[size_index];
        string_organization_set[size_index] = [];

        for (let i = 0; i < string_organization.length; i ++ ) {
            let str = string_organization[i];

            if (size_index == 2) {
                string_organization_set[size_index].push(str.replace(/1/g, NUMBER_KEY + INNER_OPERATION_KEY));
            } else {
                // go through all potential numbers in the string at this point
                for (let searchable_value = string_organization.length - 1; searchable_value > 1; searchable_value --) {
                    // if this equation has this value lets add more values to it.
                    // sa_grp_eq_index == Searchable Group Equation Index
                    if (str.indexOf(searchable_value) !== -1) {
                        let searchable_equations = string_organization_set[searchable_value];
                        for (let sa_grp_eq_index in searchable_equations) {
                            let new_str = str.replace(new RegExp(searchable_value, "g"), searchable_equations[sa_grp_eq_index]);
                            new_str = new_str.replace(/1/g, NUMBER_KEY + INNER_OPERATION_KEY);
                            string_organization_set[size_index].push(new_str);
                        } 
                    } else {
                        string_organization_set[size_index].push(str.replace(/1/g, NUMBER_KEY + INNER_OPERATION_KEY));
                    }
                }
            }
        }

        string_organization_set[size_index] = string_organization_set[size_index].filter(function(equation, index, string_organization_set) {
            return !(/\d/g.test(equation));
        }).filter(function (equation, index, equations) {
            return equations.lastIndexOf(equation) === index;
        });
    }

    return string_organization_set[size_index];
}

function stringify(size_organization_sets) {
    let size_string_organization_set = {};

    for (let size_index in size_organization_sets) {
        let group = size_organization_sets[size_index];
        size_string_organization_set[size_index] = [];

        for (let equation_index = 0; equation_index < group.length; equation_index ++ ) {
            size_string_organization_set[size_index].push(`(${group[equation_index].join(JOIN_NUMBERS)})`);
        }
    }

    return generateStringOrganizationSet(size_string_organization_set);
}

function generateSizeOrganizationSets(number) {
    let size_organization_sets = {};
    for (let i = 2; i <= number; i ++) {
        size_organization_sets[i] = Organize.generate(i);
    }

    return size_organization_sets;
}

/**
 * Inserts the order of numbers into the given equation.
 * 
 * @return {string}                    The equation with the numbers inserted.
 */
function insertOrder(organization, number_set) {

    for (number in number_set) {
        organization = organization.replace(NUMBER_KEY, number_set[number]);
    }

    return organization;
}

exports.generate = function (numbers) {
    let size_organization_sets = generateSizeOrganizationSets(numbers.length);
    let string_organization_set = stringify(size_organization_sets);
    let organizations = [];

    for (let organization_index in string_organization_set) {
        organizations.push(insertOrder(string_organization_set[organization_index], numbers));
    }

    return organizations;
}