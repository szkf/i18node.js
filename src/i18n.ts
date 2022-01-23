import fs from 'fs'
import { transtale } from './translate'
import { fallbacksI, i18ndata } from './types'

export class I18Node {
    locales: [string, string] = ['en', 'en']
    directory: string | undefined = '../../../locales'
    fallbacks: fallbacksI = {}
    warnDefaults: boolean = true
    warnMissingTranslations: boolean = false

    constructor(data: i18ndata = { locales: ['en', 'en'], directory: '../../../locales', fallbacks: {}, warnDefaults: true, warnMissingTranslations: false }) {
        this.config(data)
    }

    config = (data: i18ndata) => {
        if (data.warnDefaults == true) this.warnDefaults = true
        if (data.locales == undefined && this.warnDefaults) console.warn('\x1b[33mNo locales specified\x1b[0m - defaults to ["en", "en"]')
        if (data.directory == undefined && this.warnDefaults) console.warn('\x1b[31mA directory is required for storing JSON locale files\x1b[0m')
        if (data.warnMissingTranslations == true) this.warnMissingTranslations = true

        this.fallbacks = data.fallbacks

        if (data.locales != undefined) this.locales = data.locales
        this.directory = data.directory

        if (this.directory == undefined || !fs.existsSync(this.directory)) throw new Error(`'\x1b[31m'Directory ${this.directory} not found'\x1b[0m'`)

        // Create missing locale JSON files

        if (!fs.existsSync(this.directory + `/${this.locales[0]}.json`)) fs.appendFileSync(this.directory + `/${this.locales[0]}.json`, '{}')
        if (!fs.existsSync(this.directory + `/${this.locales[1]}.json`)) fs.appendFileSync(this.directory + `/${this.locales[1]}.json`, '{}')

        // Create missing locale JSON files for fallbacks

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
