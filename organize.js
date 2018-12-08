function reduce(sizeOfSet) {
    var organizations = [];
    var organization = [];

    for (var i = 0; i < sizeOfSet; i ++) {
        organization = [sizeOfSet - i];
        for (var j = 0; j < i; j ++) {
            organization.push(1);
        }
        organizations.push(organization.slice(0));
    }

    return organizations;
}

function merge(organizations) {
    var newOrgArr = [];
    var organization = [];
    var pointer = 1;

    for (var i = 0; i < organizations.length; i ++) {
        organization = organizations[i].slice(0);
        newOrgArr.push(organization.slice(0));
        while (globalMergePossible(organization, pointer)) {
            if (mergePossible(organization, pointer)) {
                organization = mergeIndex(organization, pointer);
                newOrgArr.push(organization.slice(0));
                pointer ++;
            } else {
                pointer --;
            }
        }
        pointer = 1;
    }
    return newOrgArr;
}

function mergeIndex(organization, index) {
    if (organization[index + 1] > 1) { 
        organization[index] ++;
        organization[index + 1] --;
    } else {
        var value = organization.splice(index, 1)[0];
        organization[index] += value; 
    }
    return organization;
}

function globalMergePossible(organization, index) {
    return mergePossible(organization, index) || index > 0;
}

function mergePossible(organization, index) {
    return organization.length - 1 > index && organization[index - 1] > organization[index];
}

function rotate(organizations) {
    var newOrgArr = [];
    var organization = [];

    for (var i = 0; i < organizations.length; i ++) {
        organization = organizations[i].slice(0);

        do {
            newOrgArr = newOrgArr.concat(swap(organization.slice(0)));
            newOrgArr = newOrgArr.concat(swap(organization.slice(0).reverse()));
            organization.push(organization.shift())
        } while (organization.toString() !== organizations[i].toString())
    }

    return newOrgArr;
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