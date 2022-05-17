import {
  Transform,
  TransformFnParams,
  TransformOptions,
} from 'class-transformer';

export interface TrimOptions {
  /** @default 'both' */
  strategy?: 'start' | 'end' | 'both';
}

export function TrimOrNull(
  options?: TrimOptions,
  transformOptions?: TransformOptions,
): (target: any, key: string) => void {
  return Transform((sourceData: TransformFnParams) => {
    if ('string' !== typeof sourceData.value) {
      return null;
    }

    switch (options?.strategy) {
      case 'start':
        return sourceData.value.trimStart();
      case 'end':
        return sourceData.value.trimEnd();
      default:
        return sourceData.value.trim();
    }
  }, transformOptions);
}
