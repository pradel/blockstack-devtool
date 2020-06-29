import React from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalFooter,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  useToast,
} from "@chakra-ui/core";
import { useFormik, FormikErrors } from "formik";
import {
  StacksTestnet,
  StacksTransaction,
  makeSTXTokenTransfer,
  broadcastTransaction,
} from "@blockstack/stacks-transactions";
import Big from "bn.js";
import { stacksToMicro } from "../utils";

interface AccountItemSendModalValues {
  address: string;
  amount: string;
}

interface AccountItemSendModalProps {
  isOpen: boolean;
  onClose: () => void;
  privateKeyHex: string;
}

export const AccountItemSendModal = ({
  isOpen,
  onClose,
  privateKeyHex,
}: AccountItemSendModalProps) => {
  const toast = useToast();
  const formik = useFormik<AccountItemSendModalValues>({
    initialValues: {
      address: "",
      amount: "",
    },
    validate: (values) => {
      const errors: FormikErrors<AccountItemSendModalValues> = {};
      if (!values.address) {
        errors.address = "Address is required";
      }
      if (!values.amount) {
        errors.amount = "Amount is required";
      }
      return errors;
    },
    onSubmit: async (values, { setSubmitting }) => {
      const network = new StacksTestnet();
      let transaction: StacksTransaction;
      try {
        transaction = await makeSTXTokenTransfer({
          recipient: values.address,
          amount: new Big(stacksToMicro(values.amount)),
          senderKey: privateKeyHex,
          network,
        });
      } catch (error) {
        console.error(error);
        toast({
          title: "Failed to create transaction.",
          description: error.message,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
        setSubmitting(false);
        return;
      }

      try {
        const data = await broadcastTransaction(transaction, network);
        console.log(data);
        if (typeof data === "string") {
          toast({
            title: "Transaction send.",
            description: `Transaction id: ${data}`,
            status: "success",
            duration: 6000,
            isClosable: true,
          });
          onCloseModal();
        } else {
          toast({
            title: "Failed to broadcast transaction.",
            description: `${data.error} - ${data.reason}`,
            status: "error",
            duration: 9000,
            isClosable: true,
          });
          setSubmitting(false);
          return;
        }
      } catch (error) {
        console.error(error);
        toast({
          title: "Failed to broadcast transaction.",
          description: error.message,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
        setSubmitting(false);
        return;
      }
    },
  });

  const onCloseModal = () => {
    formik.resetForm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onCloseModal} size="lg">
      <ModalOverlay />
      <ModalContent rounded="md">
        <ModalBody>
          <FormControl
            mt="3"
            isInvalid={Boolean(formik.errors.address && formik.touched.address)}
          >
            <FormLabel htmlFor="address">Address</FormLabel>
            <Input
              id="address"
              name="address"
              placeholder="Address"
              onChange={formik.handleChange}
              value={formik.values.address}
            />
            <FormErrorMessage>{formik.errors.address}</FormErrorMessage>
          </FormControl>
          <FormControl
            mt="3"
            isInvalid={Boolean(formik.errors.amount && formik.touched.amount)}
          >
            <FormLabel htmlFor="amount">Amount</FormLabel>
            <Input
              id="amount"
              name="amount"
              placeholder="Amount"
              onChange={formik.handleChange}
              value={formik.values.amount}
            />
            <FormErrorMessage>{formik.errors.amount}</FormErrorMessage>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button
            variantColor="teal"
            isLoading={formik.isSubmitting}
            isDisabled={formik.isSubmitting}
            mr="3"
            onClick={formik.handleSubmit}
          >
            Send
          </Button>
          <Button onClick={onCloseModal}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
