import { ImageResponse } from 'next/og';
import { getEntry } from '../../../lib/content';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image({ params }: { params: { slug: string } }) {
  const post = getEntry('blog', params.slug, 'en');

  return new ImageResponse(
    <div
      style={{
        fontSize: 64,
        background: 'black',
        color: 'white',
        width: '100%',
        height: '100%',
        padding: 80,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {post.frontmatter.title}
    </div>,
    size,
  );
}
