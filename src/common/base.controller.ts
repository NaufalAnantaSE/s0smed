import { Controller } from '@nestjs/common';

/**
 * API Controller decorator
 * Works with global prefix set in main.ts
 */
export function ApiController(path: string): ClassDecorator {
  return Controller(path);
}
