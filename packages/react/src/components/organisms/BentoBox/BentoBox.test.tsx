import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { ProjectBentoCard } from '../ProjectBentoCard';
import { BentoBox } from './BentoBox';

function Cards() {
  return (
    <>
      <ProjectBentoCard project="odaptos" expandOnHover>
        Odaptos
      </ProjectBentoCard>
      <ProjectBentoCard project="ibp">iBP</ProjectBentoCard>
      <ProjectBentoCard project="conseil-constitutionnel" shape="rectangle" expandOnHover>
        Conseil constitutionnel
      </ProjectBentoCard>
      <ProjectBentoCard project="cv">CV</ProjectBentoCard>
      <ProjectBentoCard project="bpce">BPCE</ProjectBentoCard>
    </>
  );
}

const query = (container: HTMLElement) => container.querySelector('[data-component="ds-br-bento-box"]');

describe('BentoBox — rendu', () => {
  it('expose data-component="ds-br-bento-box"', () => {
    const { container } = render(
      <BentoBox>
        <Cards />
      </BentoBox>
    );
    expect(query(container)).toBeInTheDocument();
  });

  it('rend les cartes dans l’ordre fourni', () => {
    const { container } = render(
      <BentoBox>
        <Cards />
      </BentoBox>
    );
    const projects = Array.from(
      container.querySelectorAll('[data-component="ds-br-project-bento-card"]')
    ).map((el) => el.getAttribute('data-project'));
    expect(projects).toEqual(['odaptos', 'ibp', 'conseil-constitutionnel', 'cv', 'bpce']);
  });

  it('ajoute une className et transmet les props HTML', () => {
    render(
      <BentoBox className="custom" aria-label="Projets" data-testid="bento">
        <Cards />
      </BentoBox>
    );
    const el = screen.getByTestId('bento');
    expect(el).toHaveClass('custom');
    expect(el).toHaveAttribute('aria-label', 'Projets');
  });
});

describe('BentoBox — accessibilité', () => {
  it('grille complète : aucune violation axe', async () => {
    const { container } = render(
      <BentoBox>
        <Cards />
      </BentoBox>
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
