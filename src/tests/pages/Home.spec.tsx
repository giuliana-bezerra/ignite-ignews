import { render, screen } from '@testing-library/react';
import Home, { getStaticProps } from '../../pages';
import { stripe } from '../../services/stripe';
import { mocked } from 'ts-jest/utils';

jest.mock('next/router');
jest.mock('next-auth/client', () => {
  return {
    useSession: () => [null, false],
  };
});
jest.mock('../../services/stripe');

describe('Home page', () => {
  it('should render correctly', () => {
    render(<Home product={{ priceId: 'fake-price-id', amount: '$9.90' }} />);

    expect(screen.getByText(/\$9\.90/i)).toBeInTheDocument();
  });

  it('should load inital data', async () => {
    const retrievePricesStripeMocked = mocked(stripe.prices.retrieve);

    retrievePricesStripeMocked.mockResolvedValueOnce({
      id: 'fake-price-id',
      unit_amount: 990,
    } as any);

    const response = await getStaticProps({});

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          product: {
            priceId: 'fake-price-id',
            amount: '$9.90',
          },
        },
      })
    );
  });
});
