const fs = require("node:fs");

function merge(ObjectA, ObjectB) {
    let Buffer = ObjectB;
    if (ObjectA) Object.keys(ObjectA).forEach(key => Buffer[key] = ObjectA[key]);
    return Buffer;
};

module.exports = { merge };