import fs from 'fs'

const getJSON = (directory: string) => {
    return JSON.parse(fs.readFileSync(directory, 'utf-8'))
}

const writeJSON = (directory: string, data: Object) => {
    fs.writeFileSync(directory, JSON.stringify(data), 'utf-8')
}

export const transtale = (locales: string[], directory: string | undefined, message: string) => {
    const fromLangPath: string = directory + `/${locales[0]}.json`
    const targetLangPath: string = directory + `/${locales[1]}.json`

    var targetLang = getJSON(targetLangPath)

    if (targetLang[message] == null) {
        var fromLang = getJSON(fromLangPath)

        targetLang[message] = ''
        fromLang[message] = message

        writeJSON(fromLangPath, fromLang)
        writeJSON(targetLangPath, targetLang)
        return message
    }

    if (targetLang[message] == '') {
        return message
    }

    return targetLang[message]
}
