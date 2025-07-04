export interface Server {
  _id: string;
  name: string;
  icon: string;
  description: LocalizationString;
  map: string;
  ip: string;
  tags: Record<string, ServerTag[]>;
}

export interface LocalizationString {
  en: string;
  ru: string;
}

export interface ServerTag {
  tag: string;
  icon: string;
  color: string;
  textColor: string;
}
