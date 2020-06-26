import { derivationPaths } from "@blockstack/keychain";
import { ChainID } from "@blockstack/stacks-transactions";

export const fetcher = (...args: any) =>
  // @ts-ignore
  fetch(...args).then((res: any) => res.json());

/**
 * @description Convert micro to stacks.
 * @param amountInMicroStacks - the amount of microStacks to convert
 */
export const microToStacks = (amountInMicroStacks: string) =>
  Number(amountInMicroStacks) / Math.pow(10, 6);

/**
 * @description Return the derivation path based on the index
 */
export const getDerivationPathWithIndex = (index: number) => {
  const derivationPath = derivationPaths[ChainID.Testnet];
  return `${derivationPath.substr(0, derivationPath.length - 1)}${index}`;
};
