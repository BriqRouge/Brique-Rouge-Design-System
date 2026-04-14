/**
 * TokenStatus.tsx
 * Utilitaires pour détecter et afficher les tokens CSS chargés dans Storybook.
 *
 * Exporté par toutes les pages Fondations (Couleurs, Typographie, Espacements).
 */

import React, { useEffect, useState } from 'react';

export type TokenVar = { name: string; value: string };

// ─── Lecture des CSS custom properties depuis les feuilles de style ────────
// Itère sur document.styleSheets pour trouver les variables CSS définies
// dans un sélecteur donné (ex: ":root" ou "[data-theme=\"dark\"]").

export function getCSSVars(selector = ':root'): TokenVar[] {
  if (typeof document === 'undefined') return [];

  const vars: TokenVar[] = [];

  for (const sheet of Array.from(document.styleSheets)) {
    try {
      for (const rule of Array.from(sheet.cssRules)) {
        if (rule instanceof CSSStyleRule && rule.selectorText === selector) {
          for (const prop of Array.from(rule.style)) {
            if (prop.startsWith('--')) {
              vars.push({
                name: prop,
                value: rule.style.getPropertyValue(prop).trim(),
              });
            }
          }
        }
      }
    } catch {
      // Feuilles cross-origin inaccessibles (ignorées)
    }
  }

  return vars;
}

// Retourne "empty" si aucune variable CSS n'est détectée, "filled" sinon.
export function getTokenStatus(selector = ':root'): 'empty' | 'filled' {
  return getCSSVars(selector).length === 0 ? 'empty' : 'filled';
}

// ─── Composant : encadré état vide ────────────────────────────────────────

const styles = {
  notice: {
    border: '1px solid #e6a817',
    borderRadius: '6px',
    backgroundColor: '#fffae6',
    padding: '16px 20px',
    margin: '16px 0',
    fontFamily: 'sans-serif',
    fontSize: '14px',
    lineHeight: '1.6',
  } as React.CSSProperties,
  code: {
    background: '#f5e8c0',
    padding: '2px 6px',
    borderRadius: '3px',
    fontFamily: 'monospace',
    fontSize: '13px',
  } as React.CSSProperties,
  p: {
    margin: '6px 0 0',
  } as React.CSSProperties,
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    fontSize: '13px',
    fontFamily: 'monospace',
    marginTop: '12px',
  },
  th: {
    textAlign: 'left' as const,
    padding: '8px 12px',
    fontWeight: 600,
    borderBottom: '1px solid #e0e0e0',
    fontSize: '12px',
    color: '#555',
    fontFamily: 'sans-serif',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.04em',
  },
  td: {
    padding: '8px 12px',
    borderBottom: '1px solid #f0f0f0',
    color: '#444',
  },
};

interface EmptyNoticeProps {
  type: string;
}

export function EmptyTokenNotice({ type }: EmptyNoticeProps) {
  return (
    <div style={styles.notice}>
      <strong>⚠️ Aucun token de {type} détecté</strong>
      <p style={styles.p}>
        Lance <code style={styles.code}>make tokens</code> après avoir placé ton export
        Figma dans <code style={styles.code}>packages/tokens/tokens.json</code>.
      </p>
      <p style={styles.p}>
        Voir <strong>Démarrage → Étape 2</strong> pour le guide complet.
      </p>
      <p style={styles.p}>
        Pour tester avec des tokens d'exemple :{' '}
        <code style={styles.code}>make example</code>
      </p>
    </div>
  );
}

// ─── Composant : swatches de couleurs ─────────────────────────────────────

function isColorValue(value: string): boolean {
  const v = value.trim();
  return (
    v.startsWith('#') ||
    v.startsWith('rgb') ||
    v.startsWith('hsl') ||
    v.startsWith('oklch') ||
    v.startsWith('color(')
  );
}

export function ColorTokens() {
  const [vars, setVars] = useState<TokenVar[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Lecture après le montage pour s'assurer que les styles sont injectés
    const all = getCSSVars(':root');
    setVars(all.filter((v) => isColorValue(v.value)));
    setLoaded(true);
  }, []);

  if (!loaded) return null;

  if (vars.length === 0) {
    return <EmptyTokenNotice type="couleur" />;
  }

  return (
    <table style={styles.table}>
      <thead>
        <tr>
          <th style={{ ...styles.th, width: 44 }}>Aperçu</th>
          <th style={styles.th}>Token</th>
          <th style={styles.th}>Valeur</th>
        </tr>
      </thead>
      <tbody>
        {vars.map(({ name, value }) => (
          <tr key={name}>
            <td style={styles.td}>
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 4,
                  background: `var(${name})`,
                  border: '1px solid rgba(0,0,0,0.1)',
                }}
              />
            </td>
            <td style={{ ...styles.td, color: '#333' }}>{name}</td>
            <td style={{ ...styles.td, color: '#888' }}>{value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ─── Composant : aperçu typographie ───────────────────────────────────────

function isTypographyVar(name: string): boolean {
  return (
    name.includes('font') ||
    name.includes('line-height') ||
    name.includes('letter-spacing') ||
    name.includes('body') ||
    name.includes('heading') ||
    name.includes('typography')
  );
}

export function TypographyTokens() {
  const [vars, setVars] = useState<TokenVar[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const all = getCSSVars(':root');
    setVars(all.filter((v) => isTypographyVar(v.name)));
    setLoaded(true);
  }, []);

  if (!loaded) return null;

  if (vars.length === 0) {
    return <EmptyTokenNotice type="typographie" />;
  }

  return (
    <table style={styles.table}>
      <thead>
        <tr>
          <th style={{ ...styles.th, width: 180 }}>Aperçu</th>
          <th style={styles.th}>Token</th>
          <th style={styles.th}>Valeur</th>
        </tr>
      </thead>
      <tbody>
        {vars.map(({ name, value }) => {
          const isFontSize = name.includes('font-size') || name.includes('fontsize');
          return (
            <tr key={name}>
              <td style={styles.td}>
                {isFontSize ? (
                  <span style={{ fontSize: `var(${name})`, fontFamily: 'sans-serif', lineHeight: 1 }}>
                    Aa
                  </span>
                ) : (
                  <span style={{ fontFamily: 'monospace', color: '#aaa', fontSize: 11 }}>—</span>
                )}
              </td>
              <td style={{ ...styles.td, color: '#333' }}>{name}</td>
              <td style={{ ...styles.td, color: '#888' }}>{value}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

// ─── Composant : barres d'espacement ──────────────────────────────────────

function isSpacingVar(name: string): boolean {
  return name.includes('spacing') || name.includes('radius') || name.includes('border-width');
}

function parsePx(value: string): number {
  return parseFloat(value) || 0;
}

export function SpacingTokens() {
  const [vars, setVars] = useState<TokenVar[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const all = getCSSVars(':root');
    setVars(all.filter((v) => isSpacingVar(v.name)));
    setLoaded(true);
  }, []);

  if (!loaded) return null;

  if (vars.length === 0) {
    return <EmptyTokenNotice type="espacement" />;
  }

  const max = Math.max(...vars.map((v) => parsePx(v.value)), 1);

  return (
    <table style={styles.table}>
      <thead>
        <tr>
          <th style={{ ...styles.th, width: 200 }}>Aperçu</th>
          <th style={styles.th}>Token</th>
          <th style={styles.th}>Valeur</th>
        </tr>
      </thead>
      <tbody>
        {vars.map(({ name, value }) => {
          const px = parsePx(value);
          const widthPct = Math.max((px / max) * 160, 2);
          return (
            <tr key={name}>
              <td style={styles.td}>
                <div
                  style={{
                    width: widthPct,
                    height: 10,
                    borderRadius: 2,
                    background: '#0066FF',
                    opacity: 0.7,
                    minWidth: 2,
                  }}
                />
              </td>
              <td style={{ ...styles.td, color: '#333' }}>{name}</td>
              <td style={{ ...styles.td, color: '#888' }}>{value}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
