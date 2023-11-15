const fs = require("node:fs");
const { cerr, clog, cinfo } = require("./LogManagement");

function PathExists(strFolderPath) {
    return fs.existsSync(strFolderPath);
};


function ReadFile(strFilePath, strEncoding) {
    let content = fs.readFileSync(strFilePath, strEncoding ?? "utf-8");
    
    return content ?? "";
};

module.exports = { ReadFile, PathExists };