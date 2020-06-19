import React, { useState } from "react";
import { Box, Text, IconButton, Button, Grid } from "theme-ui";
import { Settings } from "react-feather";
import Tooltip from "@reach/tooltip";
import { Dialog } from "@reach/dialog";
import {
  createStacksPrivateKey,
  getAddressFromPrivateKey,
} from "@blockstack/stacks-transactions";

interface AccountItemProps {
  privateKeyHex: string;
}

export const AccountItem = ({ privateKeyHex }: AccountItemProps) => {
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);

  const privateKey = createStacksPrivateKey(privateKeyHex);
  const address = getAddressFromPrivateKey(privateKey.data);

  const handleOpenSettings = () => setShowSettingsDialog(true);
  const handleCloseSettings = () => setShowSettingsDialog(false);

  return (
    <Grid columns={"2fr 1fr auto"}>
      <Box p={2}>
        <Text variant="caps">Address:</Text>
        <Text>{address}</Text>
      </Box>
      <Box p={2}>
        <Text variant="caps">Balance:</Text>
        <Text>100.00 STX</Text>
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
        <Text variant="caps">Address:</Text>
        <Text>{address}</Text>

        <Text variant="caps">Private key:</Text>
        <Text>{privateKeyHex}</Text>

        <Box p={2} sx={{ display: "flex", justifyContent: "center" }}>
          <Button sx={{ cursor: "pointer" }} onClick={handleCloseSettings}>
            Close
          </Button>
        </Box>
      </Dialog>
    </Grid>
  );
};
