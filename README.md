# Sequential-Representation-Generation

Attempts to take the cowards way out and brute force all possible equations from increasing order of 1 to 9. This is built off of Inder J. Taneja's (Crazy Sequential Representation: Numbers from 0 to 11111 ...)[https://arxiv.org/pdf/1302.1479.pdf] paper that lists all possible solutions (excluding 10958) for each whole number from 0 to 11111 using a equation with the sequential contents 1 to 9.

## How to use

We used node to run the project

```
$ npm install
$ node index.js
```

It will save all of the results in result.csv

To get a specific value simply add the value your looking for (between 0 and 11111) on to the end of the run command. To get all results simply use the string version of the star symbol, `"*"`

```
$ node index.js 100
$ node index.js "*"
```

To only use a specific numeric range of numbers or an organization of numbers attach a string form of a numberical array as the second argument of the command. By default the numbers are `"[1,2,3,4,5,6,7,8,9]"`

```
$ node index.js "*" "[1,2,3,4,5,6,7,8,9]"
$ node index.js "*" "[8,8,8,8,8]"
```

To limit or add to the list of operations possible simply provide an array of string operations inside of a string as the 3rd parameter. By default the operations are `"['||', '*', '^', '-', '+']"`

```
$ node index.js "*" "[1,2,3,4,5,6,7,8,9]" "['-', '+']"
$ node index.js 888 "[8,8,8,8,8]" "['||', '*', '^', '-', '+']"
```

## Requirements

This project uses (node)[https://nodejs.org/en/]. Once installed you should have npm, the package manager, with it.