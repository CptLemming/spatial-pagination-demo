import React, { useCallback, useMemo, useRef, useState } from "react";
import { useQuery } from "@apollo/client";
import {
  FixedSizeGrid as Grid,
  GridOnItemsRenderedProps,
  GridOnScrollProps,
} from "react-window";
import { loader } from "graphql.macro";

import { Config, Fader, UserSplit } from "../types";
import { FADER_WIDTH, FADER_HEIGHT } from "../config";
import { getMoreFaders, getUserSections } from "./utils";
import FaderStrip from "./FaderStrip";
import LayerStrip from "./LayerStrip";

const GET_INITIAL_FADERS = loader("./initialFaders.graphql");
const GET_MORE_FADERS = loader("./moreFaders.graphql");

interface Props {
  height: number;
  width: number;
  config: Config;
  userSplits: UserSplit[];
}

const FaderLayout = ({ height, width, config, userSplits }: Props) => {
  const isInitialRender = useRef(true);
  const sidebarRef = useRef<Grid | null>(null);
  const [scrollPosition, setScrollPosition] = useState([0, 0]);
  const [selectedFaderId, setSelectedFaderId] = useState<string>();
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

  const userSections = useMemo(
    () => getUserSections(userSplits, config.numSections),
    [userSplits, config.numSections]
  );

  // Memo everything for best performance
  const itemData = useMemo(() => {
    const results: Record<string, Fader> = {};

    (data?.faders || []).forEach((fader) => {
      results[fader.id] = fader;
    });

    return {
      faders: results,
      height,
      userSplits,
      userSections,
      selected: selectedFaderId,
      scrollPosition,
      onSelect: setSelectedFaderId,
    };
  }, [
    height,
    data?.faders,
    userSplits,
    userSections,
    selectedFaderId,
    scrollPosition,
    setSelectedFaderId,
  ]);

  const sidebarItemData = useMemo(() => {
    return {
      height,
      selected: selectedFaderId,
      scrollPosition,
    };
  }, [height, selectedFaderId, scrollPosition]);

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

  const onGridScroll = useCallback(
    ({ scrollLeft, scrollTop }: GridOnScrollProps) => {
      if (sidebarRef.current) {
        sidebarRef.current.scrollTo({ scrollLeft: 0, scrollTop });
      }
      setScrollPosition([scrollLeft, scrollTop]);
    },
    []
  );

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ display: "flex", flexDirection: "row", width }}>
      <Grid
        ref={sidebarRef}
        columnCount={1}
        columnWidth={50}
        height={height}
        rowCount={(config.numLayers || 0) * (config.numSublayers || 0)}
        rowHeight={FADER_HEIGHT * 2}
        width={50}
        itemData={sidebarItemData}
        style={{
          overflow: "hidden",
        }}
      >
        {LayerStrip}
      </Grid>
      <Grid
        columnCount={config.numFaders || 0}
        columnWidth={FADER_WIDTH}
        height={height}
        rowCount={(config.numLayers || 0) * (config.numSublayers || 0)}
        rowHeight={FADER_HEIGHT}
        width={width - 50}
        itemData={itemData}
        onItemsRendered={onItemsRendered}
        onScroll={onGridScroll}
      >
        {FaderStrip}
      </Grid>
    </div>
  );
};

export default FaderLayout;
