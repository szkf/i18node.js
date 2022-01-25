import fs from 'fs'

export const writeJSON = (directory: string, data: Object) => {
    fs.writeFileSync(directory, JSON.stringify(data, null, 4), 'utf-8')
}
