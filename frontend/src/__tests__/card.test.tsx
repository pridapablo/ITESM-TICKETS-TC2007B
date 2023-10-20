import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; // para tener más matchers como "toBeInTheDocument"
import TicketCards from '../components/card';
import { BrowserRouter as Router } from 'react-router-dom';

describe('TicketCards Component', () => {
    it('renders without crashing', () => {
        const mockProps = {
            id: '1234567890',
            creator: {
                username: 'testUsername',
            },
        };

        render(
            <Router>
                <TicketCards {...mockProps} />
            </Router>
        );
        const elements = screen.queryAllByText(/test/i);
        expect(elements).toHaveLength(1);
    });

    it('shows full description when "Más" is clicked', () => {
        const mockProps = {
            id: '32412312',
            creator: {
                username: 'testUsername',
            },
            description: 'This is a test d2132escription that is supposed to be longer than thirty characters',
        };

        render(
            <Router>
                <TicketCards {...mockProps} />
            </Router>
        );
        // const moreButton = screen.getByText(/Más/i);
        // fireEvent.click(moreButton);

        const elements = screen.queryAllByText(/test/i);
        expect(elements).toHaveLength(2);
    });
});

describe('TicketCards Component', () => {
    it('renders without crashing', () => {
        const mockProps = {
            id: '123456721332890',
            creator: {
                username: 'testUsername',
            },
        };

        render(
            <Router>
                <TicketCards {...mockProps} />
            </Router>
        );
        const elements = screen.queryAllByText(/test/i);
        expect(elements).toHaveLength(1);
    });

    it('shows full description when "Más" is clicked', () => {
        const mockProps = {
            id: '123412321567890',
            creator: {
                username: 'testUsername',
            },
            description: 'This is a test description that is supposed to be longer than thirty characters',
        };

        render(
            <Router>
                <TicketCards {...mockProps} />
            </Router>
        );

        // const moreButton = screen.getByText(/Más/i);
        // fireEvent.click(moreButton);

        const elements = screen.queryAllByText(/test/i);
        expect(elements).toHaveLength(2);
    });
});
