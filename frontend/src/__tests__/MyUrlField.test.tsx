import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { RecordContextProvider } from 'react-admin';
import MyUrlField from '../components/MyUrlField';


describe('<MyUrlField />', () => {

  it('renders the correct URL and icon', () => {
    const mockRecord = {
      myUrl: 'https://example.com'
    };

    const { getByText, container } = render(
      <RecordContextProvider value={mockRecord}>
        <MyUrlField source="myUrl" />
      </RecordContextProvider>
    );

    // Comprobar que la URL se renderiza correctamente
    const link = getByText('https://example.com').closest('a');
    expect(link).toHaveAttribute('href', 'https://example.com');
    
    // Comprobar que el icono LaunchIcon se renderiza
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});
