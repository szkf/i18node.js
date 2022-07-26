import fs from 'fs'

const getJSON = (directory: string) => {
    return JSON.parse(fs.readFileSync(directory, 'utf-8'))
}

export default getJSON
