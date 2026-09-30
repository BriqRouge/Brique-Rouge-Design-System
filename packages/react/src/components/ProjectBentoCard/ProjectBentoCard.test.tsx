import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { ProjectBentoCard } from './ProjectBentoCard';
import { ProjectCardDescription } from '../ProjectCardDescription';

describe('ProjectBentoCard — rendu', () => {
  it('affiche le contenu (children)', () => {
    render(
      <ProjectBentoCard project="odaptos">
        <img src="/screenshot.png" alt="Aperçu du projet Odaptos" />
      </ProjectBentoCard>
    );
    expect(screen.getByRole('img', { name: 'Aperçu du projet Odaptos' })).toBeInTheDocument();
  });

  it('expose data-component="ds-br-project-bento-card"', () => {
    const { container } = render(<ProjectBentoCard project="odaptos">Contenu</ProjectBentoCard>);
    expect(container.querySelector('[data-component="ds-br-project-bento-card"]')).toBeInTheDocument();
  });

  it('expose data-project et data-shape', () => {
    const { container } = render(
      <ProjectBentoCard project="conseil-constitutionnel" shape="rectangle">
        Contenu
      </ProjectBentoCard>
    );
    const card = container.querySelector('[data-component="ds-br-project-bento-card"]');
    expect(card).toHaveAttribute('data-project', 'conseil-constitutionnel');
    expect(card).toHaveAttribute('data-shape', 'rectangle');
  });

  it('shape="square" par défaut', () => {
    const { container } = render(<ProjectBentoCard project="cv">Contenu</ProjectBentoCard>);
    expect(container.querySelector('[data-component="ds-br-project-bento-card"]')).toHaveAttribute(
      'data-shape',
      'square'
    );
  });

  it("n'affiche pas de description si non fournie", () => {
    render(<ProjectBentoCard project="cv">Contenu</ProjectBentoCard>);
    expect(screen.queryByText('Product Design')).not.toBeInTheDocument();
  });

  it('rend la description (toujours présente dans le DOM, révélée en CSS au survol)', () => {
    render(
      <ProjectBentoCard
        project="odaptos"
        description={
          <ProjectCardDescription project="Odaptos" year="2024" category="Product Design">
            Refonte de la plateforme AI-SaaS
          </ProjectCardDescription>
        }
      >
        Contenu
      </ProjectBentoCard>
    );
    expect(screen.getByText('Product Design')).toBeInTheDocument();
  });

  it('ajoute une className supplémentaire', () => {
    const { container } = render(
      <ProjectBentoCard project="odaptos" className="custom">
        Contenu
      </ProjectBentoCard>
    );
    expect(container.querySelector('.custom')).toBeInTheDocument();
  });
});

describe('ProjectBentoCard — accessibilité', () => {
  it('sans description : aucune violation axe', async () => {
    const { container } = render(
      <ProjectBentoCard project="bpce">
        <img src="/screenshot.png" alt="Aperçu du projet BPCE" />
      </ProjectBentoCard>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('avec description : aucune violation axe', async () => {
    const { container } = render(
      <ProjectBentoCard
        project="ibp"
        description={
          <ProjectCardDescription project="iBP" year="2024" category="Product | Research OPS">
            Industrialiser la User Research
          </ProjectCardDescription>
        }
      >
        <img src="/screenshot.png" alt="Aperçu du projet iBP" />
      </ProjectBentoCard>
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
