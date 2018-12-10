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
        newOrgArr = newOrgArr.concat(orientations(organizations[i]));
    }

    return newOrgArr;
}

function orientations(organization) {
    if (organization.length == 1 || organization.toString() == organization.slice(0).reverse().toString()) {
        return [organization];
    } else if (organization.length == 2) {
        return [organization, [organization[1], organization[0]]]
    } else {
        orientation_slices = orientations(organization.slice(1));
        all_orientations = [];
        let temp_orientation;
        for (let i in orientation_slices) {
            compare_orientation = [organization[0]].concat(orientation_slices[i]);
            temp_orientation = compare_orientation.slice(0);
            do {
                temp_orientation.push(temp_orientation.shift());
                if (uniqueOrganization(temp_orientation, all_orientations)) {
                    all_orientations.push(temp_orientation.slice(0));   
                } else {
                    continue;
                }
            } while (temp_orientation.toString() !== compare_orientation.toString())
        }

        return all_orientations;
    }
}

function uniqueOrganization(organization, organizations) {
    for (let i in organizations) {
        if (organizations[i].toString() == organization.toString()) {
            return false;
        }
    }

    return true;
}

function unique(organizations) {
    let set  = new Set(organizations.map(JSON.stringify));
    return Array.from(set).map(JSON.parse);
}

function printOut(set) {
    for (let i in set) {
        console.log(set[i]);
    }
}

orientations([ 1, 2, 3, 3 ])

exports.generate = function(sizeOfSet) {
    return unique(rotate(merge(reduce(sizeOfSet))));
}