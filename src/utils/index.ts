export const fetcher = (...args: any) =>
  // @ts-ignore
  fetch(...args).then((res: any) => res.json());

/**
 * @description Convert micro to stacks.
 * @param amountInMicroStacks - the amount of microStacks to convert
 */
export const microToStacks = (amountInMicroStacks: string) =>
  Number(amountInMicroStacks) / Math.pow(10, 6);
