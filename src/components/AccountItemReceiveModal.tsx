import React from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalFooter,
  Flex,
  useToast,
} from "@chakra-ui/core";
import QRCode from "qrcode.react";

interface AccountItemSendModalProps {
  isOpen: boolean;
  onClose: () => void;
  address: string;
}

export const AccountItemReceiveModal = ({
  isOpen,
  onClose,
  address,
}: AccountItemSendModalProps) => {
  const toast = useToast();
  const onReceiveSTX = async () => {
    try {
      const data = await fetch(
        `https://sidecar.staging.blockstack.xyz/sidecar/v1/faucets/stx?address=${address}`,
        {
          method: "POST",
        }
      );
      if (data.ok) {
        const json = await data.json();
        console.log(json);
        toast({
          title: "You'll receive your testing Stacks Token (STX) momentarily.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        onClose();
      } else {
        console.error(data);
        throw new Error("Failed to request STX");
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Failed to request STX.",
        description: error.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent rounded="md">
        <ModalBody>
          <Flex mt="8" justifyContent="center">
            <QRCode value={address} />
          </Flex>
          <Flex mt="8" justifyContent="center">
            <Button variantColor="teal" onClick={onReceiveSTX}>
              Get STX from faucet
            </Button>
          </Flex>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
