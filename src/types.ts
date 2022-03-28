export interface fallbacksI {
    [key: string]: string
}

export interface i18nConfigOptions {
    locales: [string, string] | undefined
    directory: string | undefined
    warnDefaults: boolean
    fallbacks: fallbacksI
    warnMissingTranslations: boolean
}
