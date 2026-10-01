import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { ProjectOverview } from './ProjectOverview';

describe('ProjectOverview — rendu', () => {
  it('affiche le titre et la tagline', () => {
    render(
      <ProjectOverview title="Odaptos" tagline="Poser les fondations design." role="Founder Product Designer" contributions="Sales, Product Strategy.">
        Description du projet.
      </ProjectOverview>
    );
    expect(screen.getByText('Odaptos', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('— Poser les fondations design.')).toBeInTheDocument();
  });

  it('affiche le texte de description (children)', () => {
    render(
      <ProjectOverview title="Odaptos" tagline="Tagline" role="Role" contributions="Contrib">
        Texte de description du projet.
      </ProjectOverview>
    );
    expect(screen.getByText('Texte de description du projet.')).toBeInTheDocument();
  });

  it('préfixe le rôle et les contributions', () => {
    render(
      <ProjectOverview title="Odaptos" tagline="Tagline" role="Founder Product Designer" contributions="Sales, Product Strategy">
        Description
      </ProjectOverview>
    );
    expect(screen.getByText('Rôle: Founder Product Designer')).toBeInTheDocument();
    expect(screen.getByText('Contribution: Sales, Product Strategy')).toBeInTheDocument();
  });

  it('expose data-component="ds-br-project-overview"', () => {
    const { container } = render(
      <ProjectOverview title="Odaptos" tagline="Tagline" role="Role" contributions="Contrib">
        Description
      </ProjectOverview>
    );
    expect(container.querySelector('[data-component="ds-br-project-overview"]')).toBeInTheDocument();
  });

  it('accepte du contenu riche dans children (mots mis en avant)', () => {
    render(
      <ProjectOverview title="Odaptos" tagline="Tagline" role="Role" contributions="Contrib">
        <p>
          Une <span>plateforme SaaS</span> qui aide les utilisateurs.
        </p>
      </ProjectOverview>
    );
    expect(screen.getByText('plateforme SaaS')).toBeInTheDocument();
  });

  it('ajoute une className supplémentaire', () => {
    const { container } = render(
      <ProjectOverview title="Odaptos" tagline="Tagline" role="Role" contributions="Contrib" className="custom">
        Description
      </ProjectOverview>
    );
    expect(container.querySelector('.custom')).toBeInTheDocument();
  });
});

describe('ProjectOverview — accessibilité', () => {
  it('aucune violation axe', async () => {
    const { container } = render(
      <ProjectOverview
        title="Odaptos"
        tagline="Poser les fondations design d'une plateforme IA B2B SaaS."
        role="Founder Product Designer"
        contributions="Sales, Product Strategy, User research."
      >
        <p>Odaptos est une plateforme SaaS qui met à profit l&apos;IA.</p>
      </ProjectOverview>
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
