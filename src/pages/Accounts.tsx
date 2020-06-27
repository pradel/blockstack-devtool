import React from "react";
import {
  Box,
  Text,
  Flex,
  Link,
  IconButton,
  Button,
  Divider,
} from "@chakra-ui/core";
import { derivationPaths } from "@blockstack/keychain";
import { ChainID } from "@blockstack/stacks-transactions";
import { GitHub, Twitter, User, FileText, Settings } from "react-feather";
import { AccountItem } from "../components/AccountItem";
import { HeaderInfos } from "../components/HeaderInfos";
import { useAppConfig } from "../context/AppConfigContext";

export const Accounts = () => {
  const { appConfig } = useAppConfig();

  return (
    <React.Fragment>
      <Box px={4} py={4} maxWidth="1024px" margin="0 auto">
        <Flex alignItems="center" justifyContent="space-between">
          <Text>blockstack-devtool</Text>
          <Flex>
            <Button mr="5" leftIcon={User} variant="ghost">
              Accounts
            </Button>
            <Button mr="5" leftIcon={FileText} variant="ghost">
              Contracts
            </Button>
          </Flex>
          <Button leftIcon={Settings} variant="ghost">
            Settings
          </Button>
        </Flex>
      </Box>
      <Divider margin="0" />

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

      <Box mt="8" backgroundColor="gray.100">
        <Box px={4} py={2} maxWidth="1024px" margin="0 auto">
          <Flex justifyContent="space-between" alignItems="center">
            <Text fontSize="sm" color="gray.500">
              <Link isExternal href="https://twitter.com/leopradel">
                @leopradel
              </Link>
            </Text>

            <Box>
              <Link
                isExternal
                href="https://github.com/pradel/blockstack-devtool"
                mr="3"
              >
                <IconButton
                  aria-label="Github"
                  icon={GitHub}
                  color="gray.400"
                />
              </Link>
              <Link isExternal href="https://twitter.com/leopradel">
                <IconButton
                  aria-label="Twitter"
                  icon={Twitter}
                  color="gray.400"
                />
              </Link>
            </Box>
          </Flex>
        </Box>
      </Box>
    </React.Fragment>
  );
};
