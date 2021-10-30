import { render, screen } from '@testing-library/react';
import { getSession } from 'next-auth/client';
import { mocked } from 'ts-jest/utils';
import Post, { getServerSideProps } from '../../pages/posts/[slug]';
import { getPrismicClient } from '../../services/prismic';

const post = {
  slug: 'my-new-post',
  title: 'my new post',
  content: '<p>post content</p>',
  updatedAt: '01 de abril de 2021',
};

jest.mock('next-auth/client');
jest.mock('../../services/prismic');

describe('Posts page', () => {
  it('should render correctly', () => {
    render(<Post post={post} />);

    expect(screen.getByText('my new post')).toBeInTheDocument();
    expect(screen.getByText('post content')).toBeInTheDocument();
  });

  it('should redirect user without subscription', async () => {
    const getSessionMocked = mocked(getSession);

    getSessionMocked.mockReturnValueOnce(null);

    const response = await getServerSideProps({
      params: {
        slug: 'my-new-post',
      },
    } as any);

    expect(response).toEqual(
      expect.objectContaining({
        redirect: expect.objectContaining({
          destination: '/',
        }),
      })
    );
  });

  it('should load initial data', async () => {
    const getSessionMocked = mocked(getSession);
    const getPrismicClientMocked = mocked(getPrismicClient);

    getSessionMocked.mockReturnValueOnce({
      activeSubscription: 'fake-active-subscription',
    } as any);
    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [
            {
              type: 'heading',
              text: 'my new post',
            },
          ],
          content: [
            {
              type: 'paragraph',
              text: 'post content',
            },
          ],
        },
        last_publication_date: '04-01-2021',
      }),
    } as any);

    const response = await getServerSideProps({
      params: {
        slug: 'my-new-post',
      },
    } as any);

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
            slug: 'my-new-post',
            title: 'my new post',
            content: '<p>post content</p>',
            updatedAt: '01 de abril de 2021',
          },
        },
      })
    );
  });
});
