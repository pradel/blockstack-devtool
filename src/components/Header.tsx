import React from "react";
import { Box, Divider, Flex, Text, Button } from "@chakra-ui/core";
import { Settings, FileText, User } from "react-feather";

export const Header = () => {
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
    </React.Fragment>
  );
};
