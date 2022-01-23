export interface fallbacksI {
    [key: string]: string
}

export interface i18ndata {
    locales: [string, string] | undefined
    directory: string | undefined
    warnDefaults: boolean
    fallbacks: fallbacksI
    warnMissingTranslations: boolean
}
