import fs from 'fs'

const getJSON = (directory: string) => {
    return JSON.parse(fs.readFileSync(directory, 'utf-8'))
}

const writeJSON = (directory: string, data: Object) => {
    fs.writeFileSync(directory, JSON.stringify(data, null, 4), 'utf-8')
}

export const transtale = (locales: string[], directory: string | undefined, message: string, values: any = {}) => {
    const fromLangPath: string = directory + `/${locales[0]}.json`
    const targetLangPath: string = directory + `/${locales[1]}.json`

    var targetLang = getJSON(targetLangPath)
    var fromLang = undefined

    var returnMsg = message

    var passStringValRegExp: any = /\$\(.+?\)/g

    // message doesn't exist in targetLang JSON
    if (targetLang[message] == undefined) {
        if (fromLang == undefined) fromLang = getJSON(fromLangPath)

        targetLang[message] = ''
        fromLang[message] = message

        writeJSON(fromLangPath, fromLang)
        writeJSON(targetLangPath, targetLang)
    }

    // message exists in targetLang JSON
    if (targetLang[message] != '') returnMsg = targetLang[message]

    // Pass String Value "$(str val)"
    var matches: RegExpMatchArray | null = returnMsg.match(passStringValRegExp)

    if (matches != null) {
        if (fromLang == undefined) fromLang = getJSON(fromLangPath)

        for (var i = 0; i < matches.length; i++) {
            var match = matches[i].slice(2, matches[i].length - 1) // slice out the "$(" and ")"

            if (values[match] != undefined) {
                var replaceVal = values[match]

                if (targetLang[replaceVal] == null) {
                    targetLang[replaceVal] = ''
                    fromLang[replaceVal] = replaceVal
                } else if (targetLang[replaceVal] != '') {
                    replaceVal = targetLang[replaceVal]
                }

                returnMsg = returnMsg.replace(matches[i], replaceVal)
            }
        }

        writeJSON(fromLangPath, fromLang)
        writeJSON(targetLangPath, targetLang)
    }

    return returnMsg
}
