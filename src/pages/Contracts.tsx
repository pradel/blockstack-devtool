import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  Flex,
  Divider,
  List,
  ListItem,
  ListIcon,
} from "@chakra-ui/core";
import { FileText } from "react-feather";
import { useAppConfig } from "../context/AppConfigContext";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
const { ipcRenderer } = window.require("electron");

export const Contracts = () => {
  const { appConfig } = useAppConfig();
  const [files, setFiles] = useState<string[]>();

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
        {files && (
          <List spacing="3">
            {files.map((file) => (
              <ListItem key={file}>
                <ListIcon icon={FileText} />
                {file}
              </ListItem>
            ))}
          </List>
        )}
      </Box>
      <Footer />
    </React.Fragment>
  );
};
