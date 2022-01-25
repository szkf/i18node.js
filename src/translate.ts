import { getJSON } from './getJSON'
import { fallbacksI } from './types'
import { writeJSON } from './writeJSON'

export const transtale = (
    locales: string[],
    directory: string | undefined,
    fallbacks: fallbacksI,
    warnMissingTranslations: boolean,
    message: string,
    values: any = {}
) => {
    const fromLangPath: string = directory + `/${locales[0]}.json`
    const targetLangPath: string = directory + `/${locales[1]}.json`

    var targetLang = getJSON(targetLangPath)
    var fromLang = undefined
    var fallbackLang = undefined

    var returnMsg = message

    var passStringValRegExp: any = /\$\(.+?\)/g
    var passValIgnoreTranslate: any = /\!\(.+?\)/g

    // message doesn't exist in targetLang JSON
    if (targetLang[message] == undefined) {
        if (warnMissingTranslations) console.warn(`\x1b[33mNew blank translation added!\x1b[0m "${message}"`)

        if (fromLang == undefined) fromLang = getJSON(fromLangPath)

        targetLang[message] = ''
        fromLang[message] = message

        writeJSON(fromLangPath, fromLang)
        writeJSON(targetLangPath, targetLang)

        if (fallbacks[locales[1]]) {
            fallbackLang = getJSON(directory + `/${fallbacks[locales[1]]}.json`)
            if (fallbackLang[message] != '' && fallbackLang[message] != undefined) {
                returnMsg = fallbackLang[message]
            }
        }
    } else if (targetLang[message] == '') {
        if (warnMissingTranslations) console.warn(`\x1b[33mNo translation found!\x1b[0m "${message}"`)

        if (fallbacks[locales[1]]) {
            fallbackLang = getJSON(directory + `/${fallbacks[locales[1]]}.json`)
            if (fallbackLang[message] != '' && fallbackLang[message] != undefined) {
                returnMsg = fallbackLang[message]
            }
        }
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
                    if (warnMissingTranslations) console.warn(`\x1b[33mNew translation added!\x1b[0m "${message}"`)

                    if (fallbacks[locales[1]]) {
                        fallbackLang = getJSON(directory + `/${fallbacks[locales[1]]}.json`)
                        if (fallbackLang[replaceVal] != '' && fallbackLang[replaceVal] != undefined) {
                            replaceVal = fallbackLang[replaceVal]
                        }
                    }
                } else if (targetLang[replaceVal] == '') {
                    if (warnMissingTranslations) console.warn(`\x1b[33mNo translation found!\x1b[0m "${message}"`)

                    if (fallbacks[locales[1]]) {
                        fallbackLang = getJSON(directory + `/${fallbacks[locales[1]]}.json`)
                        if (fallbackLang[replaceVal] != '' && fallbackLang[replaceVal] != undefined) {
                            replaceVal = fallbackLang[replaceVal]
                        }
                    }
                } else if (targetLang[replaceVal] != '') {
                    replaceVal = targetLang[replaceVal]
                }

                returnMsg = returnMsg.replace(matches[i], replaceVal)
            }
        }

        writeJSON(fromLangPath, fromLang)
        writeJSON(targetLangPath, targetLang)
    }

    // Pass Value Without Translating
    var noTranslateMatches = returnMsg.match(passValIgnoreTranslate)

    if (noTranslateMatches != null) {
        for (var i = 0; i < noTranslateMatches.length; i++) {
            var noTranslateMatch = noTranslateMatches[i].slice(2, noTranslateMatches[i].length - 1)

            if (values[noTranslateMatch] != undefined) {
                returnMsg = returnMsg.replace(noTranslateMatches[i], values[noTranslateMatch])
            }
        }
    }

    return returnMsg
}
