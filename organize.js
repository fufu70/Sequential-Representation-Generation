function reduce(sizeOfSet) {
    var organizations = [];
    var tempOrg = [];

    for (var i = 0; i < sizeOfSet; i ++) {
        tempOrg = [sizeOfSet - i];
        for (var j = 0; j < i; j ++) {
            tempOrg.push(1);
        }
        organizations.push(tempOrg.slice(0));
    }

    return organizations;
}

function merge(organizations) {
    var tempOrgs = [];
    var tempOrg = [];
    var pointer = 1;

    for (var i = 0; i < organizations.length; i ++) {
        tempOrg = organizations[i].slice(0);
        tempOrgs.push(tempOrg.slice(0));
        while (globalMergePossible(tempOrg, pointer)) {
            if (mergePossible(tempOrg, pointer)) {
                tempOrg = mergeIndex(tempOrg, pointer);
                tempOrgs.push(tempOrg.slice(0));
                pointer ++;
            } else {
                pointer --;
            }
        }
        pointer = 1;
    }
    return tempOrgs;
}

function mergeIndex(tempOrg, index) {
    if (tempOrg[index + 1] > 1) { 
        tempOrg[index] ++;
        tempOrg[index + 1] --;
    } else {
        var value = tempOrg.splice(index, 1)[0];
        tempOrg[index] += value; 
    }
    return tempOrg;
}

function globalMergePossible(organization, index) {
    return mergePossible(organization, index) || index > 0;
}

function mergePossible(organization, index) {
    return organization.length - 1 > index && index > 0 && organization[index - 1] > organization[index];
}

function rotate(organizations) {
    var tempOrgs = [];
    var tempOrg = [];
    var pointer = 1;

    for (var i = 0; i < organizations.length; i ++) {
        tempOrg = organizations[i].slice(0);

        do {
            tempOrgs = tempOrgs.concat(swap(tempOrg.slice(0)));
            tempOrgs = tempOrgs.concat(swap(tempOrg.slice(0).reverse()));
            tempOrg.push(tempOrg.shift())
        } while (tempOrg.toString() !== organizations[i].toString())
    }

    return tempOrgs;
}

function swap(organization) {
    var organizations = [organization];

    for (var j = 0; j < organization.length; j ++) {
        for (var k = 0; k < organization.length; k ++) {
            organization = swapIndex(organization.slice(0), j, k);
            organizations.push(organization.slice(0))
        }
    }

    return organizations;
}

function swapIndex(organization, index1, index2) {
    var temp = organization[index1];
    organization[index1] = organization[index2];
    organization[index2] = temp;
    return organization
}

function unique(organizations) {
    let set  = new Set(organizations.map(JSON.stringify));
    return Array.from(set).map(JSON.parse);
}

exports.generate = function(sizeOfSet) {
    return unique(rotate(merge(reduce(sizeOfSet))));
}