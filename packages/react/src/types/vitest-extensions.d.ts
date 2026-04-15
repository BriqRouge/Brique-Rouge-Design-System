// Extension de l'interface Assertion de Vitest pour toHaveNoViolations (jest-axe)
// export {} rend ce fichier un module, requis pour que l'augmentation fonctionne
export {};

declare module 'vitest' {
  interface Assertion {
    toHaveNoViolations(): void;
  }
  interface AsymmetricMatchersContaining {
    toHaveNoViolations(): void;
  }
}
