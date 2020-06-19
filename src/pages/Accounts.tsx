import React, { useState } from "react";
import { Container, Box, IconButton } from "theme-ui";
import { Plus } from "react-feather";
import Tooltip from "@reach/tooltip";
import { makeRandomPrivKey } from "@blockstack/stacks-transactions";
import { AccountItem } from "../components/AccountItem";

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
    <Container px={4} py={4}>
      {accounts.map((account) => (
        <AccountItem
          key={account.privateKeyHex}
          privateKeyHex={account.privateKeyHex}
        />
      ))}

      <Box pt={4} sx={{ display: "flex", justifyContent: "center" }}>
        <Tooltip label="Generate a new account">
          <IconButton
            sx={{
              height: 8,
              width: 8,
              cursor: "pointer",
            }}
            onClick={handleGenerateNewKey}
          >
            <Plus />
          </IconButton>
        </Tooltip>
      </Box>
    </Container>
  );
};
