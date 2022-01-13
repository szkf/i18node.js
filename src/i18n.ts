import fs from 'fs'
import { transtale } from './translate'
import { i18ndata } from './types'

export class I18Node {
    locales: [string, string] = ['en', 'en']
    directory: string = '../../../locales'
    warnMissingTranslations: boolean = false

    constructor(data: i18ndata = { locales: ['en', 'en'], directory: '../../../locales', warnMissingTranslations: false }) {
        this.config(data)
    }

    config = (data: i18ndata) => {
        if (data.locales == undefined) console.warn('\x1b[33mNo locales specified\x1b[0m - defaults to ["en", "en"]')
        if (data.directory == undefined) throw new Error('\x1b[31mA directory is required for storing JSON locale files\x1b[0m')
        if (data.warnMissingTranslations == true) this.warnMissingTranslations = true

        if (data.locales != undefined) this.locales = data.locales
        this.directory = data.directory

        if (this.directory == undefined || !fs.existsSync(this.directory)) throw new Error(`'\x1b[31m'Directory ${this.directory} not found'\x1b[0m'`)

        // Create missing locale JSON files

        if (!fs.existsSync(this.directory + `/${this.locales[0]}.json`)) fs.appendFileSync(this.directory + `/${this.locales[0]}.json`, '{}')
        if (!fs.existsSync(this.directory + `/${this.locales[1]}.json`)) fs.appendFileSync(this.directory + `/${this.locales[1]}.json`, '{}')
    }

    t = (message: string, values: any = {}) => {
        return transtale(this.locales, this.directory, message, values, this.warnMissingTranslations)
    }
}
