import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { ProjectSectionDescription } from './ProjectSectionDescription';
import { AlertBanner } from '../../molecules/AlertBanner';

describe('ProjectSectionDescription — rendu', () => {
  it('affiche le numéro, le titre et le texte d\'introduction', () => {
    render(
      <ProjectSectionDescription number="01" title="Problème">
        Texte d&apos;introduction
      </ProjectSectionDescription>
    );
    expect(screen.getByText('01')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Problème' })).toBeInTheDocument();
    expect(screen.getByText("Texte d'introduction")).toBeInTheDocument();
  });

  it('expose data-component="ds-br-project-section-description"', () => {
    const { container } = render(
      <ProjectSectionDescription number="01" title="Problème">
        Texte
      </ProjectSectionDescription>
    );
    expect(container.querySelector('[data-component="ds-br-project-section-description"]')).toBeInTheDocument();
  });

  it("n'affiche pas de liste à puces si bulletPoints non fourni", () => {
    render(
      <ProjectSectionDescription number="01" title="Problème">
        Texte
      </ProjectSectionDescription>
    );
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('affiche chaque élément de bulletPoints', () => {
    render(
      <ProjectSectionDescription number="01" title="Problème" bulletPoints={['Premier point', 'Deuxième point']}>
        Texte
      </ProjectSectionDescription>
    );
    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByText('Premier point')).toBeInTheDocument();
    expect(screen.getByText('Deuxième point')).toBeInTheDocument();
  });

  it("n'affiche pas de liste à puces si bulletPoints est un tableau vide", () => {
    render(
      <ProjectSectionDescription number="01" title="Problème" bulletPoints={[]}>
        Texte
      </ProjectSectionDescription>
    );
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it("n'affiche pas de bandeau d'alerte si alertBanner non fourni", () => {
    render(
      <ProjectSectionDescription number="01" title="Problème">
        Texte
      </ProjectSectionDescription>
    );
    expect(screen.queryByText('Titre alerte')).not.toBeInTheDocument();
  });

  it("affiche le bandeau d'alerte fourni", () => {
    render(
      <ProjectSectionDescription
        number="01"
        title="Problème"
        alertBanner={<AlertBanner title="Titre alerte" />}
      >
        Texte
      </ProjectSectionDescription>
    );
    expect(screen.getByText('Titre alerte')).toBeInTheDocument();
  });

  it('ajoute une className supplémentaire', () => {
    const { container } = render(
      <ProjectSectionDescription number="01" title="Problème" className="custom">
        Texte
      </ProjectSectionDescription>
    );
    expect(container.querySelector('.custom')).toBeInTheDocument();
  });

  it('transmet les props HTML natives', () => {
    const onClick = vi.fn();
    render(
      <ProjectSectionDescription number="01" title="Problème" onClick={onClick} data-testid="section">
        Texte
      </ProjectSectionDescription>
    );
    screen.getByTestId('section').click();
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

describe('ProjectSectionDescription — accessibilité', () => {
  it('sans liste ni bandeau : aucune violation axe', async () => {
    const { container } = render(
      <ProjectSectionDescription number="01" title="Problème">
        Texte d&apos;introduction
      </ProjectSectionDescription>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('avec liste et bandeau : aucune violation axe', async () => {
    const { container } = render(
      <ProjectSectionDescription
        number="02"
        title="Objectif"
        bulletPoints={['Premier point', 'Deuxième point']}
        alertBanner={<AlertBanner title="Titre alerte" description="Description" />}
      >
        Texte d&apos;introduction
      </ProjectSectionDescription>
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
