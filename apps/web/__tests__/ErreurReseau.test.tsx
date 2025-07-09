import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ErreurReseau } from '../components/ui/ErreurReseau';

describe('ErreurReseau', () => {
  it('affiche le message d’erreur réseau', () => {
    render(<ErreurReseau message="Erreur réseau" />);
    expect(screen.getByText(/erreur réseau/i)).toBeInTheDocument();
  });
});
