import { render, screen } from '@testing-library/react';
import { SignInButton } from '.';
import { useSession } from 'next-auth/client';
import { mocked } from 'ts-jest/utils';

jest.mock('next-auth/client');

describe('SignInButton Component', () => {
  it('should render correctly when user is not authenticated', () => {
    const useSessionsMocked = mocked(useSession);
    useSessionsMocked.mockReturnValueOnce([null, false]);

    render(<SignInButton />);
    expect(screen.getByText('Sign in with Github')).toBeInTheDocument();
  });

  it('should render correctly when user is authenticated', () => {
    const useSessionsMocked = mocked(useSession);
    useSessionsMocked.mockReturnValueOnce([
      {
        user: { name: 'John Doe', email: 'john.doe@example.com' },
        expires: 'fake-expires',
      },
      false,
    ]);

    render(<SignInButton />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});
