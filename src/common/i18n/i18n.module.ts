import * as path from 'path';
import {
  I18nModule as I18nM,
  QueryResolver,
  HeaderResolver,
} from 'nestjs-i18n';
import { I18nConfig } from 'src/config/i18n.config';
import { I18nCustomParser } from './i18n-custom.parser';

export const I18nModule = I18nM.forRoot({
  fallbackLanguage: I18nConfig.defaultLanguage,
  parser: I18nCustomParser,
  parserOptions: {
    path: path.join(__dirname, '..', '..', 'i18n'),
    languages: I18nConfig.languages,
  },
  resolvers: [
    { use: QueryResolver, options: [I18nConfig.resolverField] },
    new HeaderResolver([I18nConfig.resolverField]),
  ],
});
