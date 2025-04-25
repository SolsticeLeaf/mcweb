export interface ShopItem {
    _id: string;
    name: LocalizationString;
    item: string;
    enchants: Enchant[];
    price: number;
    image: string;
    type: string;
    server: string;
    max: number;
}

export interface LocalizationString {
    en: string;
    ru: string;
}

export interface Enchant {
    name: string;
    level: number;
}