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

  it('expandOnHover="false" par défaut', () => {
    const { container } = render(<ProjectBentoCard project="bpce">Contenu</ProjectBentoCard>);
    expect(container.querySelector('[data-component="ds-br-project-bento-card"]')).toHaveAttribute(
      'data-expand-on-hover',
      'false'
    );
  });

  it('expose data-expand-on-hover="true" quand demandé', () => {
    const { container } = render(
      <ProjectBentoCard project="odaptos" expandOnHover>
        Contenu
      </ProjectBentoCard>
    );
    expect(container.querySelector('[data-component="ds-br-project-bento-card"]')).toHaveAttribute(
      'data-expand-on-hover',
      'true'
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

  it('data-has-hover-visual="false" par défaut', () => {
    const { container } = render(<ProjectBentoCard project="bpce">Contenu</ProjectBentoCard>);
    expect(container.querySelector('[data-component="ds-br-project-bento-card"]')).toHaveAttribute(
      'data-has-hover-visual',
      'false'
    );
  });

  it("n'affiche pas de visuel alternatif si hoverChildren non fourni", () => {
    render(<ProjectBentoCard project="bpce">Contenu idle</ProjectBentoCard>);
    expect(screen.queryByText('Contenu hover')).not.toBeInTheDocument();
  });

  it('rend hoverChildren (toujours présent dans le DOM, révélé en CSS au survol) et expose data-has-hover-visual="true"', () => {
    const { container } = render(
      <ProjectBentoCard project="conseil-constitutionnel" hoverChildren="Contenu hover">
        Contenu idle
      </ProjectBentoCard>
    );
    expect(screen.getByText('Contenu idle')).toBeInTheDocument();
    expect(screen.getByText('Contenu hover')).toBeInTheDocument();
    expect(container.querySelector('[data-component="ds-br-project-bento-card"]')).toHaveAttribute(
      'data-has-hover-visual',
      'true'
    );
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

  it('avec hoverChildren : aucune violation axe', async () => {
    const { container } = render(
      <ProjectBentoCard
        project="conseil-constitutionnel"
        shape="rectangle"
        expandOnHover
        hoverChildren={<img src="/screenshot-hover.png" alt="Aperçu agrandi du projet Conseil constitutionnel" />}
        description={
          <ProjectCardDescription project="Conseil constitutionnel" year="2024" category="Product Design">
            Conception de l&apos;expérience utilisateur du site web
          </ProjectCardDescription>
        }
      >
        <img src="/screenshot.png" alt="Aperçu du projet Conseil constitutionnel" />
      </ProjectBentoCard>
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
