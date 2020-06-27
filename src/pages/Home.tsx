import React from "react";
import { Flex, Text, Heading, Button, Box } from "@chakra-ui/core";
const { ipcRenderer } = window.require("electron");

export const Home = () => {
  const onSelectFolder = async () => {
    const result: { filePaths?: string[] } = await ipcRenderer.invoke(
      "select-project-folder"
    );
    if (result.filePaths && result.filePaths.length > 0) {
      const folderPath = result.filePaths[0];
    }
  };

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
