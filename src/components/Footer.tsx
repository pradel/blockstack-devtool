import React from "react";
import { Box, Flex, Text, Link, IconButton } from "@chakra-ui/core";
import { Twitter, GitHub } from "react-feather";

export const Footer = () => {
  return (
    <Box mt="8" backgroundColor="gray.100">
      <Box px={4} py={2} maxWidth="1024px" margin="0 auto">
        <Flex justifyContent="space-between" alignItems="center">
          <Text fontSize="sm" color="gray.500">
            <Link isExternal href="https://twitter.com/leopradel">
              @leopradel
            </Link>
          </Text>

          <Box>
            <Link
              isExternal
              href="https://github.com/pradel/blockstack-devtool"
              mr="3"
            >
              <IconButton aria-label="Github" icon={GitHub} color="gray.400" />
            </Link>
            <Link isExternal href="https://twitter.com/leopradel">
              <IconButton
                aria-label="Twitter"
                icon={Twitter}
                color="gray.400"
              />
            </Link>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
};