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
        this.config(configOptions)
    }

    config(configOptions: i18nConfigOptions) {
        if (configOptions.warnDefaults) {
            if (configOptions.locales == undefined) console.warn('No locales specified - defaults to ["en", "en"]')
            if (configOptions.directory == undefined) console.warn('A directory is required for storing JSON locale files')
        }

        if (configOptions.locales != undefined) this.locales = configOptions.locales
        if (configOptions.directory != undefined) this.directory = configOptions.directory
        if (configOptions.fallbacks != undefined) this.fallbacks = configOptions.fallbacks
        if (configOptions.warnDefaults != undefined) this.warnDefaults = configOptions.warnDefaults
        if (configOptions.warnMissingTranslations != undefined) this.warnMissingTranslations = configOptions.warnMissingTranslations

        if (this.directory == undefined || !fs.existsSync(this.directory)) throw new Error(`Directory ${path.resolve(String(this.directory))} not found`)

        if (!fs.existsSync(this.directory + `/${this.locales[0]}.json`)) fs.appendFileSync(this.directory + `/${this.locales[0]}.json`, '{}')
        if (!fs.existsSync(this.directory + `/${this.locales[1]}.json`)) fs.appendFileSync(this.directory + `/${this.locales[1]}.json`, '{}')

        if (this.locales.length != 2) throw new Error('Config option "locales" must be an array of length 2')
        if (typeof this.locales[0] != 'string' || typeof this.locales[1] != 'string') throw new Error('Config option "locales" must be a string array')
        if (typeof this.directory != 'string') throw new Error('Config option "directory" must be type string')
        if (typeof this.warnDefaults != 'boolean') throw new Error('Config option "warnDefaults" must be type boolean')
        if (typeof this.warnMissingTranslations != 'boolean') throw new Error('Config option "warnMissingTranslations" must be type boolean')

        // Fallback JSON locale files

        var fallbackKeys: string[] = Object.keys(this.fallbacks)
        var fallbackLanguages: string[] = Object.values(this.fallbacks)

        for (var i: number = 0; i < fallbackKeys.length; i++) {
            if (typeof fallbackKeys[i] != 'string')
                throw new Error(`Invalid fallback locale '${fallbackKeys[i]}', must be type string, instead got type '${typeof fallbackKeys[i]}'`)
            if (typeof fallbackLanguages[i] != 'string')
                throw new Error(`Invalid fallback locale '${fallbackLanguages[i]}', must be type string, instead got type '${typeof fallbackLanguages[i]}'`)
            if (!fs.existsSync(this.directory + `/${fallbackKeys[i]}.json`)) fs.appendFileSync(this.directory + `/${fallbackKeys[i]}.json`, '{}')
            if (!fs.existsSync(this.directory + `/${fallbackLanguages[i]}.json`)) fs.appendFileSync(this.directory + `/${fallbackLanguages[i]}.json`, '{}')
        }
    }

    t(message: string, values: any = {}) {
        return transtale(this.locales, this.directory, this.fallbacks, this.warnMissingTranslations, message, values)
    }
}
