import React from "react";
import { Divider, Box, Text, Flex } from "theme-ui";
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
        <Box sx={{ display: "flex", flex: 1, flexDirection: "column" }}>
          <Text>Current block</Text>
          <Text>{!blocksData ? "..." : blocksData.results[0].height}</Text>
        </Box>
      </Flex>
      <Divider sx={{ marginLeft: 0, marginRight: 0 }} />
    </React.Fragment>
  );
};
