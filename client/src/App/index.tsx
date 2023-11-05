import React from "react";
import { useQuery } from "@apollo/client";
import AutoSizer from "react-virtualized-auto-sizer";
import { loader } from "graphql.macro";

import { Config, UserSplit } from "../types";
import FaderLayout from "../FaderLayout";

const GET_CONFIG = loader("./config.graphql");
const GET_USER_SPLITS = loader("./userSplits.graphql");

const App = () => {
  // Fetch config before autosizer to cut down on re-renders
  // We can use a query here as this data doesn't change
  const { data, loading } = useQuery<{ config: Config }>(GET_CONFIG);
  const { data: userSplitData, loading: userSplitLoading } =
    useQuery<{ userSplits: [UserSplit] }>(GET_USER_SPLITS);

  if (loading || userSplitLoading) return <div>Loading...</div>;

  return (
    <AutoSizer>
      {({ height, width }) => (
        <FaderLayout
          height={height}
          width={width}
          config={
            data?.config || {
              numFaders: 0,
              numLayers: 0,
              numSublayers: 0,
              numSections: 0,
            }
          }
          userSplits={userSplitData?.userSplits || []}
        />
      )}
    </AutoSizer>
  );
};

export default App;
