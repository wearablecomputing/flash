const os = require('os');
const path = require('path');
const Max = require('max-api');
const { exec } = require("child_process");
const { networkInterfaces } = require('os');
const { spawn } = require('child_process');

const nets = networkInterfaces();
const results = Object.create(null); // Or just '{}', an empty object

var pathName = __filename;
var fileName = pathName.replace(/^.*[\\\/]/, '');
pathName = pathName.replace(fileName, '');
pathName = pathName.replace("patchers", "");
const executablePath = path.join(pathName, "externals", "dist");


function getIP() {
    const nets = os.networkInterfaces();

    // clear the results object
    Object.keys(results).forEach(function (key) {
        delete results[key];
    });

    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            // Skip over non-IPv4 and internal
            const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4;
            if (net.family === familyV4Value && !net.internal) {
                if (net.address.startsWith("192.168")) {
                    Max.outlet("ip " + net.address);
                }
                else {
                    Max.outlet("ip " + net.address);
                }
            }
        }
    }
}

function runCommand(prefix, args) {
    const command = args;
    const child = exec(command, { shell: true });
    child.stdout.on('data', (data) => {
        if (prefix == "port") {
            parseArduinoCLIOutput(data);
            return;
        }
        var lines = data.split("\n");
        for (var i = 0; i < lines.length; i++) {
            Max.outlet(prefix + " " + lines[i]);

        }
    });
    child.stderr.on('data', (data) => {
        Max.outlet("stderr: " + data);
    }
    );
    child.on('error', (error) => {
        Max.outlet("error: " + error.message);
    }
    );
    child.on('close', (code) => {
        Max.outlet("close: " + code);
    }
    );
}

function parseArduinoCLIOutput(input) {
    var lines = input.split(/\r?\n/); // Split the input into lines
    var results = [];

    for (var i = 0; i < lines.length; i++) {
        var line = lines[i].trim();
        if (line.indexOf('COM') === 0 || line.indexOf('/dev') === 0) { // Check if the line starts with 'COM' or '/dev'
            var parts = line.split(/\s+/); // Split the line into parts
            var port = parts[0];
            // Assuming the board name is always in the 5th column
            var boardNameIndex = 4; // Adjust if necessary
            var boardName = parts.slice(boardNameIndex).join(' ');
            results.push({ port: port, boardName: boardName });
        }
    }
    // Output the results
    for (var j = 0; j < results.length; j++) {
        Max.outlet("port " + results[j].port + ' ' + results[j].boardName);
    }

}

function findOS() {
    var os = process.platform;
    return os;
}

function constructCommand(ssid, password, ip, port, usb) {
    const os = findOS();
    let joinedPath = "";
    if (os == "win32") {
        joinedPath = path.join(executablePath, "main.exe");
    }
    else if (os == "darwin") {
        joinedPath = path.join(executablePath, "main");
    }
    else {
        Max.post("OS not supported");
        return;
    }

    var command = "\"" + joinedPath + "\" --ssid \"" + ssid + "\" --password \"" + password + "\" --ip " + ip + " --port " + port + " --usb \"" + usb + "\"";
    command = command.replace(/(\r\n|\n|\r)/gm, "");

    runCommand("flash", command);
}
function printPorts() {
    const os = findOS();
    let joinedPath = "";
    if (os == "win32") {
        joinedPath = path.join(executablePath, "main.exe");
    }
    else if (os == "darwin") {
        joinedPath = path.join(executablePath, "main");
    }
    else {
        Max.post("OS not supported");
        return;
    }
    var command = "\"" + joinedPath + "\" --print";
    runCommand("port", command);
}

function gitPull() {
    const command = "git pull";
    const subprocess = spawn(command, { shell: true });
    subprocess.stdout.on('data', (data) => {
        // if is up to date then don't print anything
        if (data.includes("Already up to date" || data.includes("Aborting") || data.includes("0")) || data == 0) {
            return;
        }

        Max.outlet("git " + data);
    });
    subprocess.stderr.on('data', (data) => {
        Max.outlet("git " + data);
    });
    subprocess.on('error', (error) => {
        Max.outlet("git " + error.message);
    });
    subprocess.on('close', (code) => {
        Max.outlet("git " + code);
    });


}

Max.addHandler("flash", (ssid, password, ip, port, usb) => {
    constructCommand(ssid, password, ip, port, usb);
});

Max.addHandler("serial", (msg) => {
    printPorts();
});

Max.addHandler("ip", (msg) => {
    getIP();
});

Max.addHandler("runCommand", (msg) => {
    runCommand(msg);
});

Max.addHandler("git", (msg) => {
    gitPull();
});

Max.outlet("ready");
