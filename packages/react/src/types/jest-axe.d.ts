// Déclaration ambiante pour jest-axe (pas de types natifs dans v9)
declare module 'jest-axe' {
  import type { AxeResults } from 'axe-core';

  export interface JestAxeConfigureOptions {
    rules?: Record<string, { enabled: boolean }>;
    [key: string]: unknown;
  }

  export function axe(
    html: Element | string,
    options?: JestAxeConfigureOptions
  ): Promise<AxeResults>;

  export function configureAxe(options: JestAxeConfigureOptions): void;

  export const toHaveNoViolations: {
    toHaveNoViolations(received: AxeResults): { pass: boolean; message(): string };
  };
}
