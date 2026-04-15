import '@testing-library/jest-dom';
import { configureAxe, toHaveNoViolations } from 'jest-axe';
import { expect } from 'vitest';

expect.extend(toHaveNoViolations);

configureAxe({
  rules: {
    'color-contrast': { enabled: false },
  },
});
