import getJSON from './getJSON'
import writeJSON from './writeJSON'
import { fallback } from './fallback'
import { fallbacksI } from './types'

const transtale = (
    locales: [string, string],
    directory: string | undefined,
    fallbacks: fallbacksI,
    warnMissingTranslations: boolean,
    message: string,
    values: any = {}
) => {
    const sourceLangPath: string = directory + `/${locales[0]}.json`
    const targetLangPath: string = directory + `/${locales[1]}.json`
    const fallbackLangPath: string = directory + `/${fallbacks[locales[1]]}.json`

    var targetLang: any = getJSON(targetLangPath)
    var sourceLang: any = undefined
    var fallbackLang = undefined

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

            targetLang[message] = { full: '' }
            sourceLang[message] = { full: '' }

            for (var i = 0; i < pluralMatches.length; i++) {
                var pluralSelector = pluralMatches[i].slice(2, -1)
                targetLang[message][pluralSelector] = {}
                targetLangPlurals.resolvedOptions().pluralCategories.forEach((e) => (targetLang[message][pluralSelector][e] = ''))
                sourceLang[message][pluralSelector] = {}
                sourceLangPlurals.resolvedOptions().pluralCategories.forEach((e) => (sourceLang[message][pluralSelector][e] = ''))
            }

            writeJSON(targetLangPath, targetLang)
            writeJSON(sourceLangPath, sourceLang)

            translation = message

            if (warnMissingTranslations) console.warn(`New blank translation added! "${message}"`)
        } else {
            if (targetLang[message].full == '') {
                if (sourceLang == undefined) sourceLang = getJSON(sourceLangPath)

                if (sourceLang[message].full != '') {
                    translation = sourceLang[message].full
                } else {
                    translation = message
                }
            } else translation = targetLang[message].full

            // Translation exists

            for (var i = 0; i < pluralMatches.length; i++) {
                var pluralSelector = pluralMatches[i].slice(2, -1)

                var pluralNum: number | undefined = values[pluralSelector]

                if (pluralNum != undefined) {
                    var targetPluralRule = targetLangPlurals.select(pluralNum)

                    if (targetLang[message][pluralSelector][targetPluralRule] == '') {
                        if (sourceLang == undefined) sourceLang = getJSON(sourceLangPath)

                        var sourcePluralRule = sourceLangPlurals.select(pluralNum)

                        if (sourceLang[message][pluralSelector][sourcePluralRule] != '') {
                            var replacePluralString = sourceLang[message][pluralSelector][targetPluralRule].replace(pluralMatches[i], pluralNum.toString())
                            translation = translation.replace(pluralMatches[i], replacePluralString)
                        } else {
                            // todo: try to fallback
                            translation = message.replace(pluralMatches[i], pluralNum.toString())
                        }

                        if (warnMissingTranslations) console.warn(`No translation found! "${message}"`)
                    } else {
                        var replacePluralString = targetLang[message][pluralSelector][targetPluralRule].replace(pluralMatches[i], pluralNum.toString())
                        translation = translation.replace(pluralMatches[i], replacePluralString)
                    }
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

        if (fallbackLang == undefined) fallbackLang = getJSON(fallbackLangPath)
        var fallbackVal = fallback(fallbackLang, locales, directory, fallbacks, message)
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

                    if (fallbackLang == undefined) fallbackLang = getJSON(fallbackLangPath)
                    var fallbackVal = fallback(fallbackLang, locales, directory, fallbacks, replaceVal)
                    if (fallbackVal != undefined) replaceVal = fallbackVal
                    writeJSON(targetLangPath, targetLang)
                } else if (targetLang[replaceVal] == '') {
                    if (warnMissingTranslations) console.warn(`No translation found! "${message}"`)

                    if (fallbackLang == undefined) fallbackLang = getJSON(fallbackLangPath)
                    var fallbackVal = fallback(fallbackLang, locales, directory, fallbacks, replaceVal)
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

export default transtale
