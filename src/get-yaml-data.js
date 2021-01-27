const { readFileSync } = require('fs')
const path = require('path')
const yaml = require('js-yaml') 

function readYaml(configPath) {
    try {
        const fileContents = readFileSync(path.resolve(__dirname, configPath), 'utf-8')
        const data = yaml.load(fileContents)

        return data.services
    } catch(err) {
        console.error(err)
        return false
    }
}

module.exports = readYaml