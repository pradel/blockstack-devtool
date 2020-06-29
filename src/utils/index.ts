import { derivationPaths } from "@blockstack/keychain";
import {
  ChainID,
  createStacksPrivateKey,
  getAddressFromPrivateKey,
  TransactionVersion,
} from "@blockstack/stacks-transactions";
import { bip32 } from "bitcoinjs-lib";
import { ecPairToHexString } from "blockstack";
import { ECPair } from "bitcoinjs-lib";

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
 * @description Convert stacks to micro.
 * @param amountInStacks - the amount of stacks to convert
 */
export const stacksToMicro = (amountInStacks: string) =>
  Number(amountInStacks) * Math.pow(10, 6);

/**
 * @description Return the derivation path based on the index
 */
export const getDerivationPathWithIndex = (derivationIndex: number) => {
  const derivationPath = derivationPaths[ChainID.Testnet];
  return `${derivationPath.substr(
    0,
    derivationPath.length - 1
  )}${derivationIndex}`;
};

export const getAccountFromDerivationPathIndex = (
  rootNode: bip32.BIP32Interface,
  derivationIndex: number
) => {
  const derivationPath = getDerivationPathWithIndex(derivationIndex);
  const childKey = rootNode.derivePath(derivationPath);
  if (!childKey.privateKey) {
    throw new Error(
      "Unable to derive private key from `rootNode`, bip32 master keychain"
    );
  }
  const ecPair = ECPair.fromPrivateKey(childKey.privateKey);
  const privateKeyHex = ecPairToHexString(ecPair);
  const privateKey = createStacksPrivateKey(privateKeyHex);
  const address = getAddressFromPrivateKey(
    privateKey.data,
    TransactionVersion.Testnet
  );
  return { address, privateKeyHex };
};
