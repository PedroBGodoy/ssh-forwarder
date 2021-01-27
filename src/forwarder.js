const tunnel = require('tunnel-ssh')

function forward({ username, passphrase, host, port, serviceName, dstHost, dstPort, privateKey, localPort, localHost='127.0.0.1' }) {
    var config = {
        username,
        passphrase,
        host,
        port,
        dstHost,
        dstPort,
        localHost,
        localPort,
        privateKey,
    };

    tunnel(config, function (error) {
        if (error) throw error
        console.log(`${serviceName.padEnd(13, ' ')} - ${localHost}:${localPort.toString().padEnd(5, ' ')} -> ${dstHost}:${dstPort.toString().padEnd(5, ' ')}`)
    });
}

module.exports = forward