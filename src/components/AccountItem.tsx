import React, { useState } from "react";
import { Button, Box, Grid, IconButton, Text, Flex } from "@chakra-ui/core";
import { Settings } from "react-feather";
import Tooltip from "@reach/tooltip";
import { Dialog } from "@reach/dialog";
import {
  createStacksPrivateKey,
  getAddressFromPrivateKey,
  TransactionVersion,
} from "@blockstack/stacks-transactions";
import type { TransactionResults } from "@blockstack/stacks-blockchain-sidecar-types";
import useSWR from "swr";
import { fetcher, microToStacks } from "../utils";

interface BalanceResponse {
  stx: {
    balance: string;
  };
}

interface AccountItemProps {
  privateKeyHex: string;
}

export const AccountItem = ({ privateKeyHex }: AccountItemProps) => {
  const privateKey = createStacksPrivateKey(privateKeyHex);
  const address = getAddressFromPrivateKey(
    privateKey.data,
    TransactionVersion.Testnet
  );

  const [showSettingsDialog, setShowSettingsDialog] = useState(false);

  const { data: balanceData } = useSWR<BalanceResponse>(
    `https://sidecar.staging.blockstack.xyz/sidecar/v1/address/${address}/balances`,
    fetcher
  );

  const { data: transactionsData } = useSWR<TransactionResults>(
    `https://sidecar.staging.blockstack.xyz/sidecar/v1/address/${address}/transactions?limit=1`,
    fetcher
  );

  const handleOpenSettings = () => setShowSettingsDialog(true);
  const handleCloseSettings = () => setShowSettingsDialog(false);

  return (
    <Grid templateColumns={"3fr 1fr 1fr auto"} py={2}>
      <Box>
        <Text>Address:</Text>
        <Text>{address}</Text>
      </Box>
      <Box>
        <Text>Balance:</Text>
        <Text>
          {!balanceData ? "..." : microToStacks(balanceData.stx.balance)} STX
        </Text>
      </Box>
      <Box>
        <Text>Tx count:</Text>
        <Text>{!transactionsData ? "..." : transactionsData.total}</Text>
      </Box>
      <Flex alignItems="center">
        <Tooltip label="Settings">
          <IconButton
            aria-label="Settings"
            icon={Settings}
            onClick={handleOpenSettings}
          />
        </Tooltip>
      </Flex>

      <Dialog
        aria-label="Informations"
        isOpen={showSettingsDialog}
        onDismiss={handleCloseSettings}
      >
        <Box py={2}>
          <Text>Address:</Text>
          <Text>{address}</Text>
        </Box>
        <Box py={2}>
          <Text>Private key:</Text>
          <Text>{privateKeyHex}</Text>
        </Box>

        <Box py={2} sx={{ display: "flex", justifyContent: "center" }}>
          <Button onClick={handleCloseSettings}>Close</Button>
        </Box>
      </Dialog>
    </Grid>
  );
};
