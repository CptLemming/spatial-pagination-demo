import React, { memo, useMemo } from "react";
import { areEqual } from "react-window";

import { getFaderId } from "./utils";
import {
  FaderContainer,
  FaderHeader,
  FaderContent,
  UserSplit as StyledUserSplit,
} from "./styled";
import { UserSplit } from "../types";
import { FADER_HEIGHT } from "../config";

const FaderStrip = memo(({ data, columnIndex, rowIndex, style }: any) => {
  const faderId = getFaderId(columnIndex, rowIndex);
  const fader = data.faders[faderId];
  const isSelected = data.selected === faderId;
  const userSplits = data.userSplits as [UserSplit];
  const userSections = data.userSections as Record<number, number>;

  const currentSectionUserArea = userSections[fader?.section];
  const nextSectionUserArea = userSections[fader?.section + 1];

  const isFirstInSection = columnIndex % 8 === 0;
  const isLastInSection = columnIndex % 8 === 7;

  const userSplit = userSplits[currentSectionUserArea];

  const isFirstInUserArea =
    isFirstInSection && userSplit?.firstSection === fader?.section;
  const isLastInUserArea =
    isLastInSection && currentSectionUserArea !== nextSectionUserArea;

  const styles = useMemo(() => {
    if (isFirstInUserArea || isLastInUserArea) {
      const topPosition = rowIndex * FADER_HEIGHT;
      const scrollTop = data.scrollPosition[1];
      const height = data.height;
      return {
        transform: `translateY(calc(${
          scrollTop + height - topPosition - FADER_HEIGHT - 18
        }px))`,
      };
    }
    return undefined;
  }, [
    isFirstInUserArea,
    isLastInUserArea,
    rowIndex,
    data.scrollPosition,
    data.height,
  ]);

  return (
    <FaderContainer
      isFirstInUserArea={isFirstInUserArea}
      isLastInUserArea={isLastInUserArea}
      style={style}
    >
      <FaderContent
        $isLoaded={!!fader}
        $isSelected={isSelected}
        onClick={() => data.onSelect(faderId)}
      />
      <FaderHeader>{columnIndex + 1}</FaderHeader>

      {userSplit && (isFirstInUserArea || isLastInUserArea) && (
        <StyledUserSplit
          userArea={userSplit.user}
          isFirstInSection={isFirstInUserArea}
          isLastInSection={isLastInUserArea}
          style={styles}
        >
          {`User ${userSplit.user + 1}`}
        </StyledUserSplit>
      )}
    </FaderContainer>
  );
}, areEqual);

export default FaderStrip;
