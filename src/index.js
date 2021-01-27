const { readFileSync } = require('fs')
const path = require('path')

const forward = require('./forwarder')
const readYaml = require('./get-yaml-data')

require('dotenv').config()

function main() {
    const yamlData = readYaml('../forward.yaml')
    fowardEachService(yamlData)
}

function fowardEachService(yamlData) {
    function isRoot(value) {
        return 'sshHost' in value
    }
    
    function isService(value) {
        return typeof value === 'object'
    }
    
    function getRootConfig(value) {
        return {
            username: value.sshUser,
            host: value.sshHost,
            port: value.sshPort,
            passphrase: value?.passphrase,
            privateKey: value.privateKey ? readFileSync(path.resolve(__dirname, '../keys/', value.privateKey)) : undefined
        }
    }
    
    function getServiceConfig(key, value) {
        return {
            serviceName: key,
            localHost: value?.localhost,
            dstHost: value.host,
            dstPort: value.remotePort,
            localPort: value.localPort
        }
    }

    for (const key in yamlData) {
        const value = yamlData[key]

        if(isRoot(value)) {
            const root = value
            const sshConfig = getRootConfig(value)
            
            for (const childKey in root) {
                const childValue = root[childKey];

                if(isService(childValue)) {
                    const serviceConfig = getServiceConfig(`${key}-${childKey}`, childValue)
        
                    forward({
                        ...sshConfig,
                        ...serviceConfig
                    })
                }
            }
        }
    }
}

main()