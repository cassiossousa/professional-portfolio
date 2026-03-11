import { compile } from '@mdx-js/mdx';
import * as runtime from 'react/jsx-runtime';

export async function renderMDX(source: string) {
  const compiled = await compile(source, {
    outputFormat: 'function-body',
    development: process.env.NODE_ENV === 'development',
  });

  const fn = new Function(String(compiled));

  const { default: MDXContent } = fn(runtime);

  return MDXContent;
}
