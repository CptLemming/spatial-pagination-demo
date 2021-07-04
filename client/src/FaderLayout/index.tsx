import React, { useCallback, useMemo, useRef, useState } from "react";
import { useQuery } from "@apollo/client";
import { FixedSizeGrid as Grid, GridOnItemsRenderedProps } from "react-window";
import { loader } from "graphql.macro";

import { Config, Fader } from "../types";
import { FADER_WIDTH, FADER_HEIGHT } from "../config";
import { getMoreFaders } from "./utils";
import FaderStrip from "./FaderStrip";

const GET_INITIAL_FADERS = loader("./initialFaders.graphql");
const GET_MORE_FADERS = loader("./moreFaders.graphql");

interface Props {
  height: number;
  width: number;
  config: Config;
}

const FaderLayout = ({ height, width, config }: Props) => {
  const isInitialRender = useRef(true);
  const [selectedFaderId, setSelectedFaderId] = useState<String>();
  // Initial query is a HTTP request: With compression this is 900 B vs 7.9 kB
  // Next payload will be received by websocket
  const { data, loading, subscribeToMore } = useQuery<{ faders: [Fader] }>(
    GET_INITIAL_FADERS,
    {
      // Grab enough items to fill the current screen
      variables: {
        x: 0,
        y: 0,
        dx: Math.ceil(width / FADER_WIDTH) + 2,
        dy: Math.ceil(height / FADER_HEIGHT) + 2,
      },
    }
  );

  // Memo everything for best performance
  const itemData = useMemo(() => {
    const results: Record<string, Fader> = {};

    (data?.faders || []).forEach((fader) => {
      results[fader.id] = fader;
    });

    return {
      faders: results,
      selected: selectedFaderId,
      onSelect: setSelectedFaderId,
    };
  }, [data?.faders, selectedFaderId, setSelectedFaderId]);

  const onItemsRendered = useCallback(
    ({
      visibleColumnStartIndex,
      visibleColumnStopIndex,
      visibleRowStartIndex,
      visibleRowStopIndex,
    }: GridOnItemsRenderedProps) => {
      if (isInitialRender.current) {
        // Skip the initial render as this would match the query above
        isInitialRender.current = false;
        return;
      }
      // Fetch the items that are now within the view
      // But limit requesting items not already fetched
      const variables = getMoreFaders(
        itemData.faders,
        visibleColumnStartIndex,
        visibleRowStartIndex,
        visibleColumnStopIndex + 2,
        visibleRowStopIndex + 2
      );
      if (variables.dx !== 0 && variables.dy !== 0) {
        subscribeToMore({
          document: GET_MORE_FADERS,
          variables,
          updateQuery: (prev, { subscriptionData }) => {
            if (!subscriptionData.data) return prev;

            // Merge the existing items with the new ones
            const loadedFaders: Record<string, Fader> = {};

            (prev.faders || []).forEach((fader) => {
              loadedFaders[fader.id] = fader;
            });

            subscriptionData.data.faders.forEach((fader) => {
              loadedFaders[fader.id] = fader;
            });

            return {
              faders: Object.values(loadedFaders) as [Fader],
            };
          },
        });
      }
    },
    [itemData.faders, subscribeToMore]
  );

  if (loading) return <div>Loading...</div>;

  return (
    <Grid
      columnCount={config.numFaders || 0}
      columnWidth={FADER_WIDTH}
      height={height}
      rowCount={(config.numLayers || 0) * (config.numSublayers || 0)}
      rowHeight={FADER_HEIGHT}
      width={width}
      itemData={itemData}
      onItemsRendered={onItemsRendered}
    >
      {FaderStrip}
    </Grid>
  );
};

export default FaderLayout;
