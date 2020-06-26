import React, { useState } from "react";
import { Box, IconButton, Flex } from "@chakra-ui/core";
import { Plus } from "react-feather";
import Tooltip from "@reach/tooltip";
import { makeRandomPrivKey } from "@blockstack/stacks-transactions";
import { AccountItem } from "../components/AccountItem";
import { HeaderInfos } from "../components/HeaderInfos";

const accountsStorageKey = "blockstack-accounts";

interface Account {
  privateKeyHex: string;
}

export const Accounts = () => {
  const [accounts, setAccounts] = useState<Account[]>(() => {
    const data = localStorage.getItem(accountsStorageKey);
    return data ? JSON.parse(data) : [];
  });

  const handleGenerateNewKey = () => {
    const privateKey = makeRandomPrivKey();
    const privateKeyHex = privateKey.data.toString("hex");
    const newAccountsList = [...accounts, { privateKeyHex }];
    setAccounts(newAccountsList);
    localStorage.setItem(accountsStorageKey, JSON.stringify(newAccountsList));
  };

  return (
    <Box px={4} py={4} maxWidth="1024px" margin="0 auto">
      <HeaderInfos />

      {accounts.map((account) => (
        <AccountItem
          key={account.privateKeyHex}
          privateKeyHex={account.privateKeyHex}
        />
      ))}

      <Flex pt={4} justifyContent="center">
        <Tooltip label="Generate a new account">
          <IconButton
            aria-label="Generate new"
            icon={Plus}
            onClick={handleGenerateNewKey}
          />
        </Tooltip>
      </Flex>
    </Box>
  );
};
