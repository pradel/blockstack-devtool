import React from "react";
import { Box, Text } from "@chakra-ui/core";
import { AccountItem } from "../components/AccountItem";
import { HeaderInfos } from "../components/HeaderInfos";
import { useAppConfig } from "../context/AppConfigContext";

export const Accounts = () => {
  const { appConfig } = useAppConfig();

  return (
    <Box px={4} py={4} maxWidth="1024px" margin="0 auto">
      <HeaderInfos />

      <Text>{appConfig.mnemonic}</Text>

      {Array.from(Array(appConfig.numberDisplayed).keys()).map((_, index) => (
        <AccountItem key={index} derivationIndex={index} />
      ))}
    </Box>
  );
};
