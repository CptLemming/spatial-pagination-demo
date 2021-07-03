import React, { useCallback, useMemo, useRef } from "react";
import { useQuery } from "@apollo/client";
import { FixedSizeGrid as Grid, GridOnItemsRenderedProps } from "react-window";
import { loader } from "graphql.macro";

import { Config, Fader } from "../types";
import { FADER_WIDTH, FADER_HEIGHT } from "../config";
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
  // Initial query is a HTTP request
  // Next payload will be received by websocket
  const { data, subscribeToMore } = useQuery<{ faders: [Fader] }>(
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
    };
  }, [data?.faders]);

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
      // TODO Prevent querying already loaded items by limiting the scope
      subscribeToMore({
        document: GET_MORE_FADERS,
        variables: {
          x: visibleColumnStartIndex,
          y: visibleRowStartIndex,
          dx: visibleColumnStopIndex + 2,
          dy: visibleRowStopIndex + 2,
        },
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
    },
    [subscribeToMore]
  );

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
