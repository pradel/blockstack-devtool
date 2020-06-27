import React from "react";
import { Box, Text, Flex, Divider } from "@chakra-ui/core";
import { derivationPaths } from "@blockstack/keychain";
import { ChainID } from "@blockstack/stacks-transactions";
import { AccountItem } from "../components/AccountItem";
import { HeaderInfos } from "../components/HeaderInfos";
import { useAppConfig } from "../context/AppConfigContext";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

export const Contracts = () => {
  const { appConfig } = useAppConfig();

  return (
    <React.Fragment>
      <Header />
      Yo
      <Footer />
    </React.Fragment>
  );
};
