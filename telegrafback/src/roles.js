const roles = {
    'root': 10,
    'admin': 7,
    'moderator': 5,
    'user': 2,
    'guest': 1,
};

const roleNames = (()=>{
    let names = {};
    for (let key in roles) {
        names[key] = key;
    }
    return names;
})()

function hasSufficientPrivileges(roleA, roleB) {
    return roles[roleA] >= roles[roleB];
}


module.exports = {
    roles,
    hasSufficientPrivileges,
    roleNames
};
