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

    var targetLang: any = getJSON(targetLangPath)
    var sourceLang: any = undefined

    var translation = message

    var pluralRegExp: any = /\#\(.+?\)/g
    var passStringValRegExp: any = /\$\(.+?\)/g
    var passValIgnoreTranslate: any = /\!\(.+?\)/g

    var pluralMatches: RegExpMatchArray | null = message.match(pluralRegExp)

    // Plurals
    if (pluralMatches != null) {
        var targetLangPlurals = new Intl.PluralRules(locales[1])
        var sourceLangPlurals = new Intl.PluralRules(locales[0])

        // No translation found - add new blank translation
        if (targetLang[message] == undefined) {
            if (sourceLang == undefined) sourceLang = getJSON(sourceLangPath)
            targetLang[message] = {}
            sourceLang[message] = {}

            targetLangPlurals.resolvedOptions().pluralCategories.forEach((e) => (targetLang[message][e] = ''))
            sourceLangPlurals.resolvedOptions().pluralCategories.forEach((e) => (sourceLang[message][e] = ''))

            writeJSON(targetLangPath, targetLang)
            writeJSON(sourceLangPath, sourceLang)

            if (warnMissingTranslations) console.warn(`New blank translation added! "${message}"`)
        } else {
            // Translation exists
            var pluralNum: number | undefined = values[pluralMatches[0].slice(2, -1)]

            if (pluralNum != undefined) {
                var targetPluralRule = targetLangPlurals.select(pluralNum)

                if (targetLang[message][targetPluralRule] == '') {
                    if (sourceLang == undefined) sourceLang = getJSON(sourceLangPath)
                    var sourcePluralRule = sourceLangPlurals.select(pluralNum)

                    if (sourceLang[message][sourcePluralRule] != '') {
                        translation = sourceLang[message][sourcePluralRule]
                        translation = translation.replace(pluralRegExp, pluralNum.toString())
                    } else {
                        translation = message.replace(pluralRegExp, pluralNum.toString())
                    }

                    if (warnMissingTranslations) console.warn(`No translation found! "${message}"`)
                } else {
                    translation = targetLang[message][targetPluralRule]
                    translation = translation.replace(pluralRegExp, pluralNum.toString())
                }
            }
        }
        // Basic translation
    } else if (targetLang[message] == undefined || targetLang[message] == '') {
        // Message doesn't exist in targetLang JSON - add new blank translation
        if (targetLang[message] == undefined) {
            if (sourceLang == undefined) sourceLang = getJSON(sourceLangPath)

            targetLang[message] = ''
            sourceLang[message] = message

            writeJSON(sourceLangPath, sourceLang)
            writeJSON(targetLangPath, targetLang)

            if (warnMissingTranslations) console.warn(`New blank translation added! "${message}"`)
        } else if (warnMissingTranslations) {
            console.warn(`No translation found! "${message}"`)
        }

        var fallbackVal = fallback(locales, directory, fallbacks, message)
        if (fallbackVal != undefined) translation = fallbackVal
    } else if (targetLang[message] != '') translation = targetLang[message] // message exists in targetLang JSON

    // Pass String Value - $(str val)
    var matches: RegExpMatchArray | null = translation.match(passStringValRegExp)

    if (matches != null) {
        if (sourceLang == undefined) sourceLang = getJSON(sourceLangPath)

        for (var i = 0; i < matches.length; i++) {
            var match = matches[i].slice(2, -1) // slice out the "$(" and ")"

            if (values[match] != undefined) {
                var replaceVal = values[match]

                if (sourceLang[replaceVal] == undefined) {
                    sourceLang[replaceVal] = replaceVal
                    writeJSON(sourceLangPath, sourceLang)
                }

                if (targetLang[replaceVal] == undefined) {
                    targetLang[replaceVal] = ''
                    if (warnMissingTranslations) console.warn(`New blank translation added! "${message}"`)

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

                translation = translation.replace(matches[i], replaceVal)
            }
        }
    }

    // Pass Value Without Translating
    var noTranslateMatches = translation.match(passValIgnoreTranslate)

    if (noTranslateMatches != null) {
        for (var i = 0; i < noTranslateMatches.length; i++) {
            var noTranslateMatch = noTranslateMatches[i].slice(2, noTranslateMatches[i].length - 1)

            if (values[noTranslateMatch] != undefined) {
                translation = translation.replace(noTranslateMatches[i], values[noTranslateMatch])
            }
        }
    }

    return translation
}
