import React, { useEffect, useState } from "react";
import { Box, List, ListItem, Button, Flex } from "@chakra-ui/core";
import { FileText } from "react-feather";
import { useAppConfig } from "../context/AppConfigContext";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { DeployContract } from "../components/DeployContract";
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
      if (files[0]) {
        setSelectedFile(files[0]);
      }
    };

    getContractFiles();
  }, []);

  return (
    <React.Fragment>
      <Header />

      <Box px={4} py={8} maxWidth="1024px" margin="0 auto" mb="8">
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
          {selectedFile && <DeployContract contractFileName={selectedFile} />}
        </Flex>
      </Box>

      <Footer />
    </React.Fragment>
  );
};
