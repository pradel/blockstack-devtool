import React from "react";
import { Box, Text, Flex, Divider } from "@chakra-ui/core";
import { derivationPaths } from "@blockstack/keychain";
import { ChainID } from "@blockstack/stacks-transactions";
import { AccountItem } from "../components/AccountItem";
import { HeaderInfos } from "../components/HeaderInfos";
import { useAppConfig } from "../context/AppConfigContext";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

export const Accounts = () => {
  const { appConfig } = useAppConfig();

  return (
    <React.Fragment>
      <Header />

      <Box px={4} py={4} maxWidth="1024px" margin="0 auto">
        <HeaderInfos />

        <Flex py={4}>
          <Box flex="1">
            <Text>Mnemonic:</Text>
            <Text>{appConfig.mnemonic}</Text>
          </Box>
          <Box>
            <Text>Path:</Text>
            <Text>{`${derivationPaths[ChainID.Testnet].substr(
              0,
              derivationPaths[ChainID.Testnet].length - 1
            )}account_index`}</Text>
          </Box>
        </Flex>

        <Divider />

        {Array.from(Array(appConfig.numberDisplayed).keys()).map((_, index) => (
          <AccountItem key={index} derivationIndex={index} />
        ))}
      </Box>

      <Footer />
    </React.Fragment>
  );
};
