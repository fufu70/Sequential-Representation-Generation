
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

function createGroupNumber(number) {
    let equation = [number];
    let pointer = 0;

    groups[number] = [];

    do {
        if ((equation[pointer] > 1 && pointer == equation.length - 1) || equation[pointer] == 2) {
            equation.push(1);
            equation[pointer] --;

            addGroupNumberEquations(equation.slice(0), number);
        } else if (equation[pointer] > 1 && pointer < equation.length - 1) {
            equation[pointer + 1] ++;
            equation[pointer] --;

            if (equation[pointer] - equation[pointer + 1] <= 1) {
                pointer ++;
            }

            addGroupNumberEquations(equation.slice(0), number);
        } else {
            pointer --;
        }

        console.log(`${pointer} ${equation[pointer]}  ${equation.slice(0)}`);
    } while (equation[0] != 1)
}



for (let i = 2; i <= size; i ++) {
    createGroupNumber(i);
}
console.log(groups);