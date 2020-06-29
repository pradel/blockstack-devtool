import React from "react";
import {
  Box,
  Grid,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  Select,
} from "@chakra-ui/core";
import { useFormik, FormikErrors } from "formik";
import {
  broadcastTransaction,
  makeSmartContractDeploy,
  StacksTransaction,
  StacksTestnet,
} from "@blockstack/stacks-transactions";
import Big from "bn.js";
import { useAppConfig } from "../context/AppConfigContext";
import { getAccountFromDerivationPathIndex } from "../utils";
const { ipcRenderer } = window.require("electron");

interface DeployContractValues {
  name: string;
  fee: number;
  accountIndex?: string;
}

interface DeployContractProps {
  contractFileName: string;
}

export const DeployContract = ({ contractFileName }: DeployContractProps) => {
  const { appConfig } = useAppConfig();
  const toast = useToast();
  const formik = useFormik<DeployContractValues>({
    initialValues: {
      name: "",
      fee: 2000,
    },
    validate: (values) => {
      const errors: FormikErrors<DeployContractValues> = {};
      if (!values.name) {
        errors.name = "Name is required";
      }
      if (!values.fee) {
        errors.fee = "Fee is required";
      }
      if (!values.accountIndex) {
        errors.accountIndex = "Account is required";
      }
      return errors;
    },
    onSubmit: async (values, { setSubmitting }) => {
      const network = new StacksTestnet();

      let transaction: StacksTransaction;
      try {
        const contract: string = await ipcRenderer.invoke(
          "get-file-at-path",
          `${appConfig.folderPath}/contracts/${contractFileName}`
        );
        const account = getAccountFromDerivationPathIndex(
          appConfig.rootNode,
          Number(values.accountIndex)
        );
        transaction = await makeSmartContractDeploy({
          contractName: values.name,
          codeBody: contract,
          senderKey: account.privateKeyHex,
          network,
          fee: new Big(values.fee),
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

  return (
    <Box flex="1">
      <form onSubmit={formik.handleSubmit}>
        <Grid templateColumns="1fr 1fr" gap={6}>
          <FormControl flex="1">
            <FormLabel htmlFor="name">Contract name</FormLabel>
            <Input
              id="name"
              name="name"
              onChange={formik.handleChange}
              value={formik.values.name}
            />
          </FormControl>
          <FormControl flex="1">
            <FormLabel htmlFor="fee">Fee</FormLabel>
            <Input
              id="fee"
              name="fee"
              onChange={formik.handleChange}
              value={formik.values.fee}
            />
          </FormControl>
          <FormControl flex="1">
            <FormLabel htmlFor="accountIndex">Account</FormLabel>
            <Select
              id="accountIndex"
              placeholder="Select account"
              onChange={formik.handleChange}
              value={formik.values.accountIndex}
            >
              {Array.from(Array(appConfig.numberDisplayed).keys()).map(
                (_, index) => (
                  <option key={index} value={index}>
                    Account - {index}
                  </option>
                )
              )}
            </Select>
          </FormControl>
        </Grid>
        <Button
          mt="6"
          variantColor="teal"
          type="submit"
          isLoading={formik.isSubmitting}
          isDisabled={formik.isSubmitting}
        >
          Deploy
        </Button>
      </form>
    </Box>
  );
};
