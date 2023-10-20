import { Request, Response } from 'express';
import { getUsers } from '../src/controllers/users.controllers';
import User from '../src/models/user';

// Mocking the User model's find method
jest.mock('../src/models/user');

describe('User Controller', () => {
    describe('getUsers', () => {
        it('should fetch users successfully', async () => {
            // Mock data
            const users = [
                { id: '1', username: 'user1', toObject: jest.fn().mockReturnThis() },
                { id: '2', username: 'user2', toObject: jest.fn().mockReturnThis() },
            ];

            // Set up the mock to return the sample data
            (User.find as jest.Mock).mockImplementation(() => {
                return {
                    select: jest.fn().mockResolvedValue(users)
                };
            });

            // Mock request and response
            const req = {} as Request;
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
                setHeader: jest.fn(),
            } as unknown as Response;

            // Call the function
            await getUsers(req, res);

            // Check if it sets the right status code and returns the right data
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(users);
        });

        // ... you can add more test cases, e.g., when there's an error
    });
});
