import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FetchRepositories from './FetchRepositories';

describe('FetchRepositories', () => {
    test('renders loading message initially', () => {
        render(<FetchRepositories />);
        const loadingElement = screen.getByText(/Loading/i);
        expect(loadingElement).toBeInTheDocument();
    });

    test('renders error message on fetch error', async () => {
        global.fetch = jest.fn(() =>
            Promise.reject(new Error('Network error'))
        );

        render(<FetchRepositories />);
        
        const errorElement = await screen.findByText(/Error:/i);
        expect(errorElement).toBeInTheDocument();
    });

    test('renders list of repositories', async () => {
        const mockData = [
            { id: '1', name: 'Repository 1' },
            { id: '2', name: 'Repository 2' },
        ];

        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockData),
            })
        );

        render(<FetchRepositories />);

      
        expect(await screen.findByText(/Repository 1/i)).toBeInTheDocument();
        expect(await screen.findByText(/Repository 2/i)).toBeInTheDocument();
    });

    test('allows editing a repository name', async () => {
        const mockData = [
            { id: '1', name: 'Repository 1' },
        ];

        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockData),
            })
        );

        render(<FetchRepositories />);

        const repoName = await screen.findByText(/Repository 1/i);
        expect(repoName).toBeInTheDocument();

    
        fireEvent.click(screen.getByText(/Edit/i));

   
        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'New Repository Name' } });
        fireEvent.click(screen.getByText(/Подтвердить/i));

        expect(await screen.findByText(/New Repository Name/i)).toBeInTheDocument();
    });
});
