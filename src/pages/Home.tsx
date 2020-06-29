import React, { useState } from "react";
import {
  Flex,
  Text,
  Heading,
  Button,
  Box,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
  useDisclosure,
  Link,
} from "@chakra-ui/core";
import { AppConfigProvider } from "../context/AppConfigContext";
import { Router } from "../Router";
const { ipcRenderer } = window.require("electron");

export const Home = () => {
  const {
    isOpen: isOpenError,
    onOpen: onOpenError,
    onClose: onCloseError,
  } = useDisclosure();
  const [folderPath, setFolderPath] = useState<string>();

  const onSelectFolder = async () => {
    const result: { filePaths?: string[] } = await ipcRenderer.invoke(
      "select-project-folder"
    );
    if (result.filePaths && result.filePaths.length > 0) {
      const folderPath = result.filePaths[0];

      const folders: string[] = await ipcRenderer.invoke(
        "get-folder-at-path",
        folderPath
      );

      const isValid = folders.find((folder) => folder === "contracts");
      if (!isValid) {
        onOpenError();
        return;
      }

      setFolderPath(folderPath);
    }
  };

  if (folderPath) {
    return (
      <AppConfigProvider folderPath={folderPath}>
        <Box backgroundColor="white">
          <Router />
        </Box>
      </AppConfigProvider>
    );
  }

  return (
    <Box backgroundColor="white">
      <Flex
        height="100vh"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        px="8"
        maxWidth="824px"
        margin="0 auto"
      >
        <Heading color="gray.900" mb="4">
          blockstack-connect
        </Heading>
        <Text mb="8" textAlign="center">
          blockstack-connect is a simple devtool interface to help you manage
          different wallets and contracts on testnet. If you have any question
          or feedback on the app feel free to{" "}
          <Link isExternal href="https://github.com/pradel/blockstack-devtool">
            open an issue on Github
          </Link>
          .
          <br />
          Hope you will like it :)
        </Text>
        {isOpenError && (
          <Alert
            status="error"
            mb="8"
            flexDirection="column"
            justifyContent="center"
            textAlign="center"
          >
            <AlertIcon size="30px" mr={0} />
            <AlertTitle mt={4} mb={1}>
              Invalid project.
            </AlertTitle>
            <AlertDescription maxWidth="md">
              It looks like the project you selected is not a valid blockstack
              project. We couldn't find a "contract" folder inside.
            </AlertDescription>
            <CloseButton
              position="absolute"
              right="8px"
              top="8px"
              onClick={onCloseError}
            />
          </Alert>
        )}
        <Button variantColor="teal" mb="2" onClick={onSelectFolder}>
          Select project
        </Button>
        <Text color="gray.500" fontSize="xs">
          Select your project folder to get started
        </Text>
      </Flex>
    </Box>
  );
};
