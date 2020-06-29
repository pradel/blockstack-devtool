import React from "react";
import { Box, Text } from "@chakra-ui/core";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { useAppConfig } from "../context/AppConfigContext";

export const Settings = () => {
  const { appConfig } = useAppConfig();

  return (
    <React.Fragment>
      <Header />

      <Box px={4} py={8} maxWidth="1024px" margin="0 auto" mb="8">
        <Text>
          The settings for your project are saved under{" "}
          <code>{`${appConfig.folderPath}/config.json`}</code>.
        </Text>
      </Box>

      <Footer />
    </React.Fragment>
  );
};
