import React from "react";
import { Box, Divider, Flex, Text } from "@chakra-ui/core";
import useSWR from "swr";
import { BlockResults } from "@blockstack/stacks-blockchain-sidecar-types";
import { fetcher } from "../utils";

export const HeaderInfos = () => {
  const { data: blocksData } = useSWR<BlockResults>(
    `https://sidecar.staging.blockstack.xyz/sidecar/v1/block?limit=1`,
    fetcher
  );

  return (
    <React.Fragment>
      <Flex>
        <Box>
          <Text>Current block</Text>
          <Text>{!blocksData ? "..." : blocksData.results[0].height}</Text>
        </Box>
      </Flex>
      <Divider />
    </React.Fragment>
  );
};
