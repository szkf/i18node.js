import { fallbacksI } from './types'
import writeJSON from './writeJSON'

export const fallback = (fallbackLang: any, locales: [string, string], directory: string | undefined, fallbacks: fallbacksI, phrase: string) => {
    if (fallbacks[locales[1]] == undefined) return undefined

    var fallbackLangPath: string = directory + `/${fallbacks[locales[1]]}.json`

    if (fallbackLang[phrase] == undefined) {
        fallbackLang[phrase] = ''
        writeJSON(fallbackLangPath, fallbackLang)
    } else if (fallbackLang[phrase] != '') {
        return fallbackLang[phrase]
    }

    return undefined
}
