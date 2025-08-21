import { Controller } from '@nestjs/common';

/**
 * API Controller decorator
 * Works with global prefix set in main.ts
 */
export function ApiController(prefix: string): ClassDecorator {
  return Controller(`api/v1${prefix}`);
}
