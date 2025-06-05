import React from "react";
import { render, screen } from '@testing-library/react';
import Header from './Header';

describe('Header', () => {
  it('renders title', () => {
    render(<Header />);
    expect(screen.getByText('Rescue-Net Europe')).toBeInTheDocument();
  });
});
