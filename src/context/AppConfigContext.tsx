import React, { createContext, useEffect, useState } from "react";
import { generateMnemonicRootKeychain } from "@blockstack/keychain";
import { Spinner, Flex } from "@chakra-ui/core";
import { mnemonicToSeed } from "bip39";
import { bip32 } from "bitcoinjs-lib";
const { ipcRenderer } = window.require("electron");

interface BlockstackAppConfig {
  folderPath: string;
  mnemonic: string;
  numberDisplayed: number;
  rootNode: bip32.BIP32Interface;
}

const AppConfigContext = createContext<{
  appConfig: BlockstackAppConfig;
}>({} as any);

interface AppConfigProviderProps {
  folderPath: string;
  children: React.ReactNode;
}

export const AppConfigProvider = ({
  children,
  folderPath,
}: AppConfigProviderProps) => {
  const [appConfig, setAppConfig] = useState<BlockstackAppConfig | undefined>(
    undefined
  );

  useEffect(() => {
    // When the app mount we get the config for the project
    loadAppConfig();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadAppConfig = async () => {
    let mnemonic: string | undefined = await ipcRenderer.invoke(
      "get-project-store-value",
      folderPath,
      "mnemonic"
    );
    if (!mnemonic) {
      mnemonic = (await generateMnemonicRootKeychain(128)).plaintextMnemonic;
      await ipcRenderer.invoke(
        "set-project-store-value",
        folderPath,
        "mnemonic",
        mnemonic
      );
    }
    let numberDisplayed: number | undefined = await ipcRenderer.invoke(
      "get-project-store-value",
      folderPath,
      "numberDisplayed"
    );
    if (!numberDisplayed) {
      numberDisplayed = 10;
      await ipcRenderer.invoke(
        "set-project-store-value",
        folderPath,
        "numberDisplayed",
        numberDisplayed
      );
    }
    const seedBuffer = await mnemonicToSeed(mnemonic);
    const rootNode = bip32.fromSeed(seedBuffer);
    setAppConfig({
      folderPath,
      mnemonic: mnemonic,
      numberDisplayed: numberDisplayed,
      rootNode,
    });
  };

  if (!appConfig) {
    return (
      <Flex height="100vh" justifyContent="center" alignItems="center">
        <Spinner size="lg" />
      </Flex>
    );
  }

  return (
    <AppConfigContext.Provider value={{ appConfig }}>
      {children}
    </AppConfigContext.Provider>
  );
};

export const useAppConfig = () => React.useContext(AppConfigContext);
