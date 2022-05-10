export const objectId = (value: string) => ({
  value,
});

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
