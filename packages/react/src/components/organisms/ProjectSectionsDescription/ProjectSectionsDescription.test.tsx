import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { ProjectSectionsDescription } from './ProjectSectionsDescription';
import { ProjectSectionDescription } from '../ProjectSectionDescription';

describe('ProjectSectionsDescription — rendu', () => {
  it('affiche le titre de la carte', () => {
    render(
      <ProjectSectionsDescription title="Design system">
        <ProjectSectionDescription number="01" title="Problème">
          Texte
        </ProjectSectionDescription>
      </ProjectSectionsDescription>
    );
    expect(screen.getByRole('heading', { name: 'Design system' })).toBeInTheDocument();
  });

  it('expose data-component="ds-br-project-sections-description"', () => {
    const { container } = render(
      <ProjectSectionsDescription title="Design system">
        <ProjectSectionDescription number="01" title="Problème">
          Texte
        </ProjectSectionDescription>
      </ProjectSectionsDescription>
    );
    expect(
      container.querySelector('[data-component="ds-br-project-sections-description"]')
    ).toBeInTheDocument();
  });

  it('affiche toutes les sections fournies en children', () => {
    render(
      <ProjectSectionsDescription title="Design system">
        <ProjectSectionDescription number="01" title="Problème">
          Texte 1
        </ProjectSectionDescription>
        <ProjectSectionDescription number="02" title="Objectif">
          Texte 2
        </ProjectSectionDescription>
      </ProjectSectionsDescription>
    );
    expect(screen.getByRole('heading', { name: 'Problème' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Objectif' })).toBeInTheDocument();
  });

  it("n'insère aucun séparateur avec une seule section", () => {
    const { container } = render(
      <ProjectSectionsDescription title="Design system">
        <ProjectSectionDescription number="01" title="Problème">
          Texte
        </ProjectSectionDescription>
      </ProjectSectionsDescription>
    );
    expect(container.querySelectorAll('[data-divider]')).toHaveLength(0);
  });

  it('insère un séparateur entre chaque section (N-1 séparateurs pour N sections)', () => {
    const { container } = render(
      <ProjectSectionsDescription title="Design system">
        <ProjectSectionDescription number="01" title="Problème">
          Texte 1
        </ProjectSectionDescription>
        <ProjectSectionDescription number="02" title="Objectif">
          Texte 2
        </ProjectSectionDescription>
        <ProjectSectionDescription number="03" title="Résultat">
          Texte 3
        </ProjectSectionDescription>
      </ProjectSectionsDescription>
    );
    expect(container.querySelectorAll('[data-divider]')).toHaveLength(2);
  });

  it('ajoute une className supplémentaire', () => {
    const { container } = render(
      <ProjectSectionsDescription title="Design system" className="custom">
        <ProjectSectionDescription number="01" title="Problème">
          Texte
        </ProjectSectionDescription>
      </ProjectSectionsDescription>
    );
    expect(container.querySelector('.custom')).toBeInTheDocument();
  });
});

describe('ProjectSectionsDescription — accessibilité', () => {
  it('une section : aucune violation axe', async () => {
    const { container } = render(
      <ProjectSectionsDescription title="Design system">
        <ProjectSectionDescription number="01" title="Problème" bulletPoints={['Point 1']}>
          Texte
        </ProjectSectionDescription>
      </ProjectSectionsDescription>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('plusieurs sections avec séparateurs : aucune violation axe', async () => {
    const { container } = render(
      <ProjectSectionsDescription title="Design system">
        <ProjectSectionDescription number="01" title="Problème">
          Texte 1
        </ProjectSectionDescription>
        <ProjectSectionDescription number="02" title="Objectif">
          Texte 2
        </ProjectSectionDescription>
      </ProjectSectionsDescription>
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
