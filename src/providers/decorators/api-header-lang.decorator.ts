import { ApiHeader } from '@nestjs/swagger';
import { I18nConfig } from 'src/config/i18n.config';

export function ApiHeaderLang(): MethodDecorator {
  return ApiHeader({
    name: I18nConfig.resolverField,
    required: false,
    schema: {
      description: '语言',
      type: 'string',
      enum: I18nConfig.languages,
      default: I18nConfig.defaultLanguage,
    },
  });
}
