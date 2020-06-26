import React from "react";
import {
  Button,
  Box,
  Grid,
  IconButton,
  Text,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  useDisclosure,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/core";
import { Settings } from "react-feather";
import Tooltip from "@reach/tooltip";
import { ecPairToHexString } from "blockstack";
import { ECPair } from "bitcoinjs-lib";
import {
  createStacksPrivateKey,
  getAddressFromPrivateKey,
  TransactionVersion,
} from "@blockstack/stacks-transactions";
import type { TransactionResults } from "@blockstack/stacks-blockchain-sidecar-types";
import useSWR from "swr";
import { fetcher, microToStacks, getDerivationPathWithIndex } from "../utils";
import { useAppConfig } from "../context/AppConfigContext";

interface BalanceResponse {
  stx: {
    balance: string;
  };
}

interface AccountItemProps {
  derivationIndex: number;
}

export const AccountItem = ({ derivationIndex }: AccountItemProps) => {
  const { appConfig } = useAppConfig();

  const derivationPath = getDerivationPathWithIndex(derivationIndex);
  const childKey = appConfig.rootNode.derivePath(derivationPath);
  if (!childKey.privateKey) {
    throw new Error(
      "Unable to derive private key from `rootNode`, bip32 master keychain"
    );
  }
  const ecPair = ECPair.fromPrivateKey(childKey.privateKey);
  const privateKeyHex = ecPairToHexString(ecPair);
  const privateKey = createStacksPrivateKey(privateKeyHex);
  const address = getAddressFromPrivateKey(
    privateKey.data,
    TransactionVersion.Testnet
  );

  const { isOpen, onOpen, onClose } = useDisclosure();

  const { data: balanceData } = useSWR<BalanceResponse>(
    `https://sidecar.staging.blockstack.xyz/sidecar/v1/address/${address}/balances`,
    fetcher
  );

  const { data: transactionsData } = useSWR<TransactionResults>(
    `https://sidecar.staging.blockstack.xyz/sidecar/v1/address/${address}/transactions?limit=1`,
    fetcher
  );

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
          <IconButton aria-label="Settings" icon={Settings} onClick={onOpen} />
        </Tooltip>
      </Flex>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent maxWidth="50rem">
          <ModalBody>
            <Box py={2}>
              <Text>Address:</Text>
              <Text>{address}</Text>
            </Box>
            <Box py={2}>
              <Text>Private key:</Text>
              <Text>{privateKeyHex}</Text>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Grid>
  );
};
