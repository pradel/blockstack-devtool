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
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras bibendum
          pretium massa, eget pulvinar lectus ultrices quis. Nulla facilisi.
          Praesent sollicitudin in velit mollis luctus. Vestibulum congue odio
          sit amet risus bibendum, vel bibendum quam feugiat. Donec viverra,
          orci a hendrerit convallis, odio ex volutpat nunc, ac sodales felis
          dolor at purus.
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
          Select folder
        </Button>
        <Text color="gray.500" fontSize="xs">
          Select your project folder to get started
        </Text>
      </Flex>
    </Box>
  );
};
