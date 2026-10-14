import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { ProjectCardDescription } from './ProjectCardDescription';

describe('ProjectCardDescription — rendu', () => {
  it('rend le projet, l’année, le titre et la catégorie', () => {
    render(
      <ProjectCardDescription project="Odaptos" year="2024" category="Product Design">
        Refonte de la plateforme AI-SaaS
      </ProjectCardDescription>
    );
    expect(screen.getByText('Odaptos')).toBeInTheDocument();
    expect(screen.getByText('2024')).toBeInTheDocument();
    expect(screen.getByText('Refonte de la plateforme AI-SaaS')).toBeInTheDocument();
    expect(screen.getByText('Product Design')).toBeInTheDocument();
  });

  it('expose data-component="ds-br-project-card-description"', () => {
    const { container } = render(
      <ProjectCardDescription project="Odaptos" year="2024" category="Product Design">
        Refonte de la plateforme AI-SaaS
      </ProjectCardDescription>
    );
    expect(container.querySelector('[data-component="ds-br-project-card-description"]')).toBeInTheDocument();
  });

  it('ajoute une className supplémentaire', () => {
    const { container } = render(
      <ProjectCardDescription project="Odaptos" year="2024" category="Product Design" className="custom">
        Refonte de la plateforme AI-SaaS
      </ProjectCardDescription>
    );
    expect(container.querySelector('.custom')).toBeInTheDocument();
  });

  it('transmet les props HTML au conteneur', () => {
    render(
      <ProjectCardDescription
        project="Odaptos"
        year="2024"
        category="Product Design"
        data-testid="card"
      >
        Refonte de la plateforme AI-SaaS
      </ProjectCardDescription>
    );
    expect(screen.getByTestId('card')).toBeInTheDocument();
  });

  it('accepte un titre multi-éléments (ex: retour à la ligne manuel)', () => {
    const { container } = render(
      <ProjectCardDescription project="Odaptos" year="2024" category="Product Design">
        Refonte de la plateforme
        <br />
        AI-SaaS
      </ProjectCardDescription>
    );
    expect(container.querySelector('br')).toBeInTheDocument();
    expect(container.textContent).toContain('AI-SaaS');
  });

  it('variant="default" par défaut (data-variant)', () => {
    const { container } = render(
      <ProjectCardDescription project="Odaptos" year="2024" category="Product Design">
        Refonte de la plateforme AI-SaaS
      </ProjectCardDescription>
    );
    expect(container.querySelector('[data-component="ds-br-project-card-description"]')).toHaveAttribute(
      'data-variant',
      'default'
    );
  });

  it('variant="cv" : affiche uniquement le titre', () => {
    const { container } = render(<ProjectCardDescription variant="cv">CV</ProjectCardDescription>);
    const card = container.querySelector('[data-component="ds-br-project-card-description"]');
    expect(card).toHaveAttribute('data-variant', 'cv');
    expect(screen.getByText('CV')).toBeInTheDocument();
    expect(card?.querySelectorAll('p')).toHaveLength(1);
  });
});

describe('ProjectCardDescription — accessibilité', () => {
  it('aucune violation axe (variant="cv")', async () => {
    const { container } = render(<ProjectCardDescription variant="cv">CV</ProjectCardDescription>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('aucune violation axe', async () => {
    const { container } = render(
      <ProjectCardDescription project="Odaptos" year="2024" category="Product Design">
        Refonte de la plateforme AI-SaaS
      </ProjectCardDescription>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('aucune violation axe avec un titre long', async () => {
    const { container } = render(
      <ProjectCardDescription
        project="Conseil constitutionnel"
        year="2023"
        category="UX Research & Product Design"
      >
        Refonte complète du portail de saisine citoyenne
      </ProjectCardDescription>
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
