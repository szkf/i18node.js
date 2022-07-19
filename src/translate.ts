import { fallback } from './fallback'
import { getJSON } from './getJSON'
import { fallbacksI } from './types'
import { writeJSON } from './writeJSON'

export const transtale = (
    locales: [string, string],
    directory: string | undefined,
    fallbacks: fallbacksI,
    warnMissingTranslations: boolean,
    message: string,
    values: any = {}
) => {
    const sourceLangPath: string = directory + `/${locales[0]}.json`
    const targetLangPath: string = directory + `/${locales[1]}.json`

    var targetLang = getJSON(targetLangPath)
    var sourceLang = undefined

    var returnMsg = message

    var pluralRegExp: any = /\#\(.+?\)/g
    var passStringValRegExp: any = /\$\(.+?\)/g
    var passValIgnoreTranslate: any = /\!\(.+?\)/g

    var pluralMatches: RegExpMatchArray | null = message.match(pluralRegExp)

    if (pluralMatches != null) {
        const targetLangPlurals = new Intl.PluralRules(locales[1])
        const sourceLangPlurals = new Intl.PluralRules(locales[0])

        if (targetLang[message] == undefined) {
            if (warnMissingTranslations) console.warn(`New blank translation added! "${message}"`)

            if (sourceLang == undefined) sourceLang = getJSON(sourceLangPath)

            var targetLangPluralRules: any = {}
            for (var i = 0; i < targetLangPlurals.resolvedOptions().pluralCategories.length; i++)
                targetLangPluralRules[targetLangPlurals.resolvedOptions().pluralCategories[i]] = ''

            var sourceLangPluralRules: any = {}
            for (var i = 0; i < sourceLangPlurals.resolvedOptions().pluralCategories.length; i++)
                sourceLangPluralRules[sourceLangPlurals.resolvedOptions().pluralCategories[i]] = ''

            targetLang[message] = targetLangPluralRules
            sourceLang[message] = sourceLangPluralRules

            writeJSON(targetLangPath, targetLang)
            writeJSON(sourceLangPath, sourceLang)
        } else {
            var pluralMatch = pluralMatches[0].slice(2, pluralMatches[0].length - 1)
            if (values[pluralMatch] != undefined) {
                var pluralRule = targetLangPlurals.select(values[pluralMatch])

                if (targetLang[message][pluralRule] == '') {
                    if (warnMissingTranslations) console.warn(`No translation found! "${message}"`)

                    var sourcePluralRule = sourceLangPlurals.select(values[pluralMatch])

                    if (sourceLang == undefined) sourceLang = getJSON(sourceLangPath)
                    if (sourceLang[message][sourcePluralRule] != '') {
                        returnMsg = sourceLang[message][sourcePluralRule]
                        returnMsg = returnMsg.replace(pluralRegExp, values[pluralMatch])
                    }
                } else {
                    returnMsg = targetLang[message][pluralRule]
                    returnMsg = returnMsg.replace(pluralRegExp, values[pluralMatch])
                }
            }
        }
    } else if (targetLang[message] == undefined || targetLang[message] == '') {
        // message doesn't exist in targetLang JSON
        if (targetLang[message] == undefined) {
            if (warnMissingTranslations) console.warn(`New blank translation added! "${message}"`)

            if (sourceLang == undefined) sourceLang = getJSON(sourceLangPath)

            targetLang[message] = ''
            sourceLang[message] = message

            writeJSON(sourceLangPath, sourceLang)
            writeJSON(targetLangPath, targetLang)
        } else {
            if (warnMissingTranslations) console.warn(`No translation found! "${message}"`)
        }

        var fallbackVal = fallback(locales, directory, fallbacks, message)
        if (fallbackVal != undefined) returnMsg = fallbackVal
    } else if (targetLang[message] != '') returnMsg = targetLang[message] // message exists in targetLang JSON

    // Pass String Value "$(str val)"
    var matches: RegExpMatchArray | null = returnMsg.match(passStringValRegExp)

    if (matches != null) {
        if (sourceLang == undefined) sourceLang = getJSON(sourceLangPath)

        for (var i = 0; i < matches.length; i++) {
            var match = matches[i].slice(2, matches[i].length - 1) // slice out the "$(" and ")"

            if (values[match] != undefined) {
                var replaceVal = values[match]

                if (sourceLang[replaceVal] == null) {
                    sourceLang[replaceVal] = replaceVal
                    writeJSON(sourceLangPath, sourceLang)
                }

                if (targetLang[replaceVal] == null) {
                    targetLang[replaceVal] = ''
                    if (warnMissingTranslations) console.warn(`New translation added! "${message}"`)

                    var fallbackVal = fallback(locales, directory, fallbacks, replaceVal)
                    if (fallbackVal != undefined) replaceVal = fallbackVal
                    writeJSON(targetLangPath, targetLang)
                } else if (targetLang[replaceVal] == '') {
                    if (warnMissingTranslations) console.warn(`No translation found! "${message}"`)

                    var fallbackVal = fallback(locales, directory, fallbacks, replaceVal)
                    if (fallbackVal != undefined) replaceVal = fallbackVal
                } else if (targetLang[replaceVal] != '') {
                    replaceVal = targetLang[replaceVal]
                }

                returnMsg = returnMsg.replace(matches[i], replaceVal)
            }
        }
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
