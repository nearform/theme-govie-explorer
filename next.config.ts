import type { NextConfig } from 'next';

const isGitHubPages = process.env.GITHUB_PAGES === 'true';
const repoName = '/theme-govie-explorer';

const nextConfig: NextConfig = {
  output: 'export',
  env: {
    NEXT_PUBLIC_BASE_PATH: isGitHubPages ? repoName : '',
  },
  ...(isGitHubPages && {
    basePath: repoName,
    assetPrefix: `${repoName}/`,
  }),
};

export default nextConfig;
