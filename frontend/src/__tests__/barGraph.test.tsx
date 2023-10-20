import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import { MyResponsiveBar } from '../components/barGraph';
import "@testing-library/jest-dom";

// Burla el componente `ResponsiveBar`
jest.mock('@nivo/bar', () => ({
  ResponsiveBar: jest.fn(() => <div data-testid="mockedResponsiveBar" />),
}));

describe('MyResponsiveBar', () => {
  it('renders without crashing', () => {
    const mockData: any = [
      // Tu data de prueba aquí, similar a la que le pasarías en un escenario real
    ];

    const { getByTestId } = render(
      <ThemeProvider theme={createTheme()}>
        <MyResponsiveBar data={mockData} />
      </ThemeProvider>
    );

    const mockedBarGraph = getByTestId('mockedResponsiveBar');
    expect(mockedBarGraph).toBeInTheDocument();
  });
});

