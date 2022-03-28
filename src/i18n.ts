import fs from 'fs'
import path from 'path'
import { transtale } from './translate'
import { fallbacksI, i18nConfigOptions } from './types'

export class I18Node {
    locales: [string, string] = ['en', 'en']
    directory: string = '../../../locales'
    fallbacks: fallbacksI = {}
    warnDefaults: boolean = true
    warnMissingTranslations: boolean = false

    constructor(configOptions: i18nConfigOptions = { locales: undefined, directory: undefined, fallbacks: {}, warnDefaults: false, warnMissingTranslations: false }) {
        var data = {
            locales: configOptions.locales,
            directory: configOptions.directory,
            fallbacks: configOptions.fallbacks,
            warnDefaults: configOptions.warnDefaults,
            warnMissingTranslations: configOptions.warnMissingTranslations,
        }

        this.config(data)
    }

    config = (configOptions: i18nConfigOptions) => {
        if (configOptions.warnDefaults) {
            if (configOptions.locales == undefined) console.warn('\x1b[33mNo locales specified\x1b[0m - defaults to ["en", "en"]')
            if (configOptions.directory == undefined) console.warn('\x1b[31mA directory is required for storing JSON locale files\x1b[0m')
        }

        if (configOptions.locales != undefined) this.locales = configOptions.locales
        if (configOptions.directory != undefined) this.directory = configOptions.directory
        if (configOptions.fallbacks != undefined) this.fallbacks = configOptions.fallbacks
        this.warnDefaults = configOptions.warnDefaults
        this.warnMissingTranslations = configOptions.warnMissingTranslations

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
