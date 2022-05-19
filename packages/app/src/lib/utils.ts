import urljoin from 'url-join';

const { PUBLIC_URL } = process.env;

export const objectId = (value: string) => ({
  value,
});

// eslint-disable-next-line no-promise-executor-return
export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const relativeUrl = (path: string) => urljoin(PUBLIC_URL || '/', path);
