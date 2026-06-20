import type { NextConfig } from "next";

const repository = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "graphrag-learning-site";
const isLocalExport = process.env.LOCAL_EXPORT === "true";
const isGithubPages =
  !isLocalExport &&
  (process.env.GITHUB_PAGES === "true" ||
    (process.env.GITHUB_ACTIONS === "true" && repository !== "hoonapps.github.io"));
const githubPagesBasePath = `/${repository}`;

const nextConfig: NextConfig = {
  output: "export",
  outputFileTracingRoot: __dirname,
  basePath: isGithubPages ? githubPagesBasePath : undefined,
  assetPrefix: isLocalExport ? "." : isGithubPages ? `${githubPagesBasePath}/` : undefined,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
