import React from "react";
import { Box, Divider, Flex, Text, Button } from "@chakra-ui/core";
import { Settings, FileText, User } from "react-feather";
import { useHistory, useLocation } from "react-router-dom";

export const Header = () => {
  const history = useHistory();
  const location = useLocation();

  return (
    <React.Fragment>
      <Box px={4} py={4} maxWidth="1024px" margin="0 auto">
        <Flex alignItems="center" justifyContent="space-between">
          <Text>blockstack-devtool</Text>
          <Flex>
            <Button
              mr="5"
              leftIcon={User}
              variant="ghost"
              onClick={() => history.push("/")}
              isActive={location.pathname === "/"}
            >
              Accounts
            </Button>
            <Button
              mr="5"
              leftIcon={FileText}
              variant="ghost"
              onClick={() => history.push("/contracts")}
              isActive={location.pathname === "/contracts"}
            >
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
