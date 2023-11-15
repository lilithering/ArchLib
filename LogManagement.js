// ENUM
RESET = "\x1b[0m"
BRIGHT = "\x1b[1m"
DIM = "\x1b[2m"
UNDERSCORE = "\x1b[4m"
BLINK = "\x1b[5m"
REVERSE = "\x1b[7m"
HIDDEN = "\x1b[8m"

FG_BLACK = "\x1b[30m"
FG_RED = "\x1b[31m"
FG_GREEN = "\x1b[32m"
FG_YELLOW = "\x1b[33m"
FG_BLUE = "\x1b[34m"
FG_MAGENTA = "\x1b[35m"
FG_CYAN = "\x1b[36m"
FG_WHITE = "\x1b[37m"
FG_GRAY = "\x1b[90m"

BG_BLACK = "\x1b[40m"
BG_RED = "\x1b[41m"
BG_GREEN = "\x1b[42m"
BG_YELLOW = "\x1b[43m"
BG_BLUE = "\x1b[44m"
BG_MAGENTA = "\x1b[45m"
BG_CYAN = "\x1b[46m"
BG_WHITE = "\x1b[47m"
BG_GRAY = "\x1b[100m"

S_INFO = [console.info, FG_WHITE];
S_ERROR = [console.error, FG_RED];
S_LOG = [console.error, FG_GREEN];

let m_expStack = /\ *at(.*)(\(.*)/;

console.log(RESET, "LOG MANAGEMENT v3.0\n------------------------------------");


function _stack() {
    let aStack = new Error().stack.split('\n');
    let FunctionName = m_expStack.exec(aStack[3])[1].trim();
    let StackLine = m_expStack.exec(aStack[4]);
    StackLine[1] = StackLine[1].trim().split(".");
    return {
        functionName: FunctionName,
        className: StackLine[1][0],
        methodName: StackLine[1][1] ?? "constructor",
        scriptPath: StackLine[2],
    };
};

function _log(aStyle, strMessage, mapContent) {
    let ConsoleOutput = aStyle[0];
    let strForegroundColor = aStyle[1];
    let Stack = _stack();

    ConsoleOutput(strForegroundColor, `${Stack.functionName} : ${Stack.className}::${Stack.methodName}(), ${new Date().toISOString()}, ${Stack.methodName}(), ${strMessage}`);

    for (let index in mapContent) {
        ConsoleOutput(`\t${index} ->`, mapContent[index]);
    }

    ConsoleOutput(FG_GRAY, `\t${Stack.scriptPath}`, RESET);
};

function cerr(strMessage, mapContent) {
    _log(S_ERROR, strMessage, mapContent);
    return false;
};

function cinfo(strMessage, mapContent) {
    _log(S_INFO, strMessage, mapContent);
    return true;
};

function clog(strMessage, mapContent) {
    _log(S_LOG, strMessage, mapContent);
    return "";
}

function debug(strMessage, mapContent, Echo) {
    _log([console.log, FG_MAGENTA], strMessage, mapContent);
    return Echo;
}

module.exports = { cerr, cinfo, clog, debug };
