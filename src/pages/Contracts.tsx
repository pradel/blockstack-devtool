import React, { useEffect, useState } from "react";
import {
  Box,
  List,
  ListItem,
  Button,
  Flex,
  Input,
  FormLabel,
  FormControl,
  Grid,
} from "@chakra-ui/core";
import { FileText } from "react-feather";
import { useAppConfig } from "../context/AppConfigContext";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
const { ipcRenderer } = window.require("electron");

export const Contracts = () => {
  const { appConfig } = useAppConfig();
  const [files, setFiles] = useState<string[]>();
  const [selectedFile, setSelectedFile] = useState<string>();

  useEffect(() => {
    const getContractFiles = async () => {
      let files: string[] = await ipcRenderer.invoke(
        "get-files-at-path",
        `${appConfig.folderPath}/contracts`
      );
      // We remove the files which are not .clar
      files = files.filter((file) => file.endsWith(".clar"));
      setFiles(files);
    };

    getContractFiles();
  }, []);

  return (
    <React.Fragment>
      <Header />

      <Box px={4} py={4} maxWidth="1024px" margin="0 auto">
        <Flex>
          <List spacing="3" mr="8">
            {files &&
              files.map((file) => (
                <ListItem key={file}>
                  <Button
                    leftIcon={FileText}
                    variant="ghost"
                    size="sm"
                    color="gray.700"
                    isActive={selectedFile === file}
                    onClick={() => setSelectedFile(file)}
                  >
                    {file}
                  </Button>
                </ListItem>
              ))}
          </List>
          {selectedFile && (
            <Box flex="1">
              <Grid templateColumns="1fr 1fr" gap={6}>
                <FormControl flex="1">
                  <FormLabel htmlFor="name">Contract name</FormLabel>
                  <Input id="name" />
                </FormControl>
                <FormControl flex="1">
                  <FormLabel htmlFor="fee">Fee</FormLabel>
                  <Input id="fee" />
                </FormControl>
              </Grid>
              <Button mt="6" variantColor="teal">
                Deploy
              </Button>
            </Box>
          )}
        </Flex>
      </Box>
      <Footer />
    </React.Fragment>
  );
};
