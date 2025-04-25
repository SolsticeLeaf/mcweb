export interface Server {
    _id: string;
    name: string;
    description: LocalizationString,
    map: string;
    ip: string;
}

export interface LocalizationString {
    en: string;
    ru: string;
}