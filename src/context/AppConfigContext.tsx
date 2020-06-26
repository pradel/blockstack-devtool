import React, { createContext, useEffect, useState } from "react";
import { generateMnemonicRootKeychain } from "@blockstack/keychain";
import { Spinner, Flex } from "@chakra-ui/core";
import { mnemonicToSeed } from "bip39";
import { bip32 } from "bitcoinjs-lib";

const appConfigStorageKey = "blockstack-devtool";

interface BlockstackAppConfigStorage {
  mnemonic: string;
  numberDisplayed: number;
}

interface BlockstackAppConfig {
  mnemonic: string;
  numberDisplayed: number;
  rootNode: bip32.BIP32Interface;
}

const AppConfigContext = createContext<{
  appConfig: BlockstackAppConfig;
}>({} as any);

interface AppConfigProviderProps {
  children: React.ReactNode;
}

export const AppConfigProvider = ({ children }: AppConfigProviderProps) => {
  const [appConfig, setAppConfig] = useState<BlockstackAppConfig | undefined>(
    undefined
  );

  useEffect(() => {
    // When the app mount we get the config from the storage
    const data = localStorage.getItem(appConfigStorageKey);
    if (!data) {
      generateNewAppConfig();
    } else {
      loadAppConfig(JSON.parse(data));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generateNewAppConfig = async () => {
    const mnemonic = await generateMnemonicRootKeychain(128);
    const defaultSettings: BlockstackAppConfigStorage = {
      mnemonic: mnemonic.plaintextMnemonic,
      numberDisplayed: 10,
    };
    localStorage.setItem(appConfigStorageKey, JSON.stringify(defaultSettings));
    await loadAppConfig(defaultSettings);
  };

  const loadAppConfig = async (data: BlockstackAppConfigStorage) => {
    const seedBuffer = await mnemonicToSeed(data.mnemonic);
    const rootNode = bip32.fromSeed(seedBuffer);
    setAppConfig({
      mnemonic: data.mnemonic,
      numberDisplayed: data.numberDisplayed,
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
