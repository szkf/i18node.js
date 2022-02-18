import fs from 'fs'
import path from 'path'
import { transtale } from './translate'
import { fallbacksI, i18ndata } from './types'

export class I18Node {
    locales: [string, string] = ['en', 'en']
    directory: string = '../../../locales'
    fallbacks: fallbacksI = {}
    warnDefaults: boolean = true
    warnMissingTranslations: boolean = false

    constructor(data: i18ndata = { locales: undefined, directory: undefined, fallbacks: {}, warnDefaults: true, warnMissingTranslations: false }) {
        this.config(data)
    }

    config = (data: i18ndata) => {
        if (data.warnDefaults) {
            if (data.locales == undefined) console.warn('\x1b[33mNo locales specified\x1b[0m - defaults to ["en", "en"]')
            if (data.directory == undefined) console.warn('\x1b[31mA directory is required for storing JSON locale files\x1b[0m')
        }

        if (data.locales != undefined) this.locales = data.locales
        if (data.directory != undefined) this.directory = data.directory
        if (data.fallbacks != undefined) this.fallbacks = data.fallbacks
        this.warnDefaults = data.warnDefaults
        this.warnMissingTranslations = data.warnMissingTranslations

        if (this.directory == undefined || !fs.existsSync(this.directory))
            throw new Error(`'\x1b[31m'Directory ${path.resolve(String(this.directory))} not found'\x1b[0m'`)

        if (!fs.existsSync(this.directory + `/${this.locales[0]}.json`)) fs.appendFileSync(this.directory + `/${this.locales[0]}.json`, '{}')
        if (!fs.existsSync(this.directory + `/${this.locales[1]}.json`)) fs.appendFileSync(this.directory + `/${this.locales[1]}.json`, '{}')

        // Fallback JSON locale files

        var fallbackKeys: string[] = Object.keys(this.fallbacks)
        var fallbackLanguages: string[] = Object.values(this.fallbacks)

        for (var i: number = 0; i < fallbackKeys.length; i++) {
            if (!fs.existsSync(this.directory + `/${fallbackKeys[i]}.json`)) fs.appendFileSync(this.directory + `/${fallbackKeys[i]}.json`, '{}')
            if (!fs.existsSync(this.directory + `/${fallbackLanguages[i]}.json`)) fs.appendFileSync(this.directory + `/${fallbackLanguages[i]}.json`, '{}')
        }
    }

    t = (message: string, values: any = {}) => {
        return transtale(this.locales, this.directory, this.fallbacks, this.warnMissingTranslations, message, values)
    }
}
