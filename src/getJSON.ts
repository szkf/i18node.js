import fs from 'fs'

export const getJSON = (directory: string) => {
    return JSON.parse(fs.readFileSync(directory, 'utf-8'))
}
