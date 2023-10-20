import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom'
import { MyResponsiveTreeMap } from '../components/boxGraph';

describe('MyResponsiveTreeMap', () => {
    it('renders without crashing', () => {
        const mockData = {
            name: "root",
            loc: 100,
        };
        jest.mock('@nivo/treemap');

        render(<MyResponsiveTreeMap data={mockData} />);
    });
});
