import React, { useState } from "react";
import { Box, Text, IconButton, Button, Grid } from "theme-ui";
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
    <Grid columns={"2fr 1fr 1fr auto"}>
      <Box p={2}>
        <Text variant="caps">Address:</Text>
        <Text>{address}</Text>
      </Box>
      <Box p={2}>
        <Text variant="caps">Balance:</Text>
        <Text>
          {!balanceData ? "..." : microToStacks(balanceData.stx.balance)} STX
        </Text>
      </Box>
      <Box p={2}>
        <Text variant="caps">Tx count:</Text>
        <Text>{!transactionsData ? "..." : transactionsData.total}</Text>
      </Box>
      <Box p={2} sx={{ display: "flex", alignItems: "center" }}>
        <Tooltip label="Settings">
          <IconButton
            sx={{ height: 8, width: 8, cursor: "pointer" }}
            onClick={handleOpenSettings}
          >
            <Settings />
          </IconButton>
        </Tooltip>
      </Box>

      <Dialog
        aria-label="Informations"
        isOpen={showSettingsDialog}
        onDismiss={handleCloseSettings}
      >
        <Box py={2}>
          <Text variant="caps">Address:</Text>
          <Text>{address}</Text>
        </Box>
        <Box py={2}>
          <Text variant="caps">Private key:</Text>
          <Text>{privateKeyHex}</Text>
        </Box>

        <Box py={2} sx={{ display: "flex", justifyContent: "center" }}>
          <Button sx={{ cursor: "pointer" }} onClick={handleCloseSettings}>
            Close
          </Button>
        </Box>
      </Dialog>
    </Grid>
  );
};
