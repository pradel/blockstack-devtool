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
import { Settings, Send } from "react-feather";
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
import { AccountItemSendModal } from "./AccountItemSendModal";
import { AccountItemReceiveModal } from "./AccountItemReceiveModal";

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
  const {
    isOpen: isOpenSend,
    onOpen: onOpenSend,
    onClose: onCloseSend,
  } = useDisclosure();
  const {
    isOpen: isOpenReceive,
    onOpen: onOpenReceive,
    onClose: onCloseReceive,
  } = useDisclosure();

  const { data: balanceData } = useSWR<BalanceResponse>(
    `https://sidecar.staging.blockstack.xyz/sidecar/v1/address/${address}/balances`,
    fetcher
  );

  const { data: transactionsData } = useSWR<TransactionResults>(
    `https://sidecar.staging.blockstack.xyz/sidecar/v1/address/${address}/transactions?limit=1`,
    fetcher
  );

  return (
    <Grid templateColumns={"3fr auto auto auto auto"} py={4}>
      <Box>
        <Text fontWeight="700">Address:</Text>
        <Text>{address}</Text>
      </Box>
      <Box mr="16">
        <Text fontWeight="700">Balance:</Text>
        <Text>
          {!balanceData ? "..." : microToStacks(balanceData.stx.balance)} STX
        </Text>
      </Box>
      <Box mr="16">
        <Text fontWeight="700">Tx count:</Text>
        <Text>{!transactionsData ? "..." : transactionsData.total}</Text>
      </Box>
      <Box mr="16">
        <Text fontWeight="700">Index:</Text>
        <Text>{derivationIndex}</Text>
      </Box>
      <Flex alignItems="center">
        <Tooltip label="Send">
          <IconButton
            aria-label="Send"
            mr="2"
            icon={Send}
            onClick={onOpenSend}
          />
        </Tooltip>
        <Tooltip label="Receive">
          <IconButton
            aria-label="Receive"
            mr="2"
            transform="rotate(180deg)"
            icon={Send}
            onClick={onOpenReceive}
          />
        </Tooltip>
        <Tooltip label="Settings">
          <IconButton aria-label="Settings" icon={Settings} onClick={onOpen} />
        </Tooltip>
      </Flex>

      <AccountItemSendModal
        isOpen={isOpenSend}
        onClose={onCloseSend}
        privateKeyHex={privateKeyHex}
      />

      <AccountItemReceiveModal
        isOpen={isOpenReceive}
        onClose={onCloseReceive}
        address={address}
      />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent maxWidth="50rem" rounded="md">
          <ModalBody>
            <Box py={3}>
              <Text fontWeight="700">Address:</Text>
              <Text>{address}</Text>
            </Box>
            <Box py={3}>
              <Text fontWeight="700">Private key:</Text>
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
