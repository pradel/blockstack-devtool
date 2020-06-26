import React from "react";
import { Box, Text, Flex } from "@chakra-ui/core";
import { AccountItem } from "../components/AccountItem";
import { HeaderInfos } from "../components/HeaderInfos";
import { useAppConfig } from "../context/AppConfigContext";
import { derivationPaths } from "@blockstack/keychain";
import { ChainID } from "@blockstack/stacks-transactions";

export const Accounts = () => {
  const { appConfig } = useAppConfig();

  return (
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

      {Array.from(Array(appConfig.numberDisplayed).keys()).map((_, index) => (
        <AccountItem key={index} derivationIndex={index} />
      ))}
    </Box>
  );
};
