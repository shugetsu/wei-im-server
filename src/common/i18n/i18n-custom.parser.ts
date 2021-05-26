import { Inject } from '@nestjs/common';
import {
  I18nJsonParserOptions,
  I18nParser,
  I18nTranslation,
  I18N_PARSER_OPTIONS,
} from 'nestjs-i18n';
import { Observable } from 'rxjs';
import { join } from 'path';

interface I18nCustomParserOptions extends Pick<I18nJsonParserOptions, 'path'> {
  languages: string[];
}

export class I18nCustomParser extends I18nParser {
  constructor(
    @Inject(I18N_PARSER_OPTIONS)
    private options: I18nCustomParserOptions,
  ) {
    super();
  }

  async languages(): Promise<string[] | Observable<string[]>> {
    return this.options.languages;
  }

  async parse(): Promise<I18nTranslation | Observable<I18nTranslation>> {
    const translation = {};
    const languages = this.options.languages;
    for (let i = 0; i < languages.length; i++) {
      const lang = require(join(this.options.path, languages[i]));
      translation[languages[i]] = lang;
    }
    return translation;
  }
}
