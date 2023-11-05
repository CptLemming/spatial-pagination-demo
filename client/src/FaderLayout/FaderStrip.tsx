import React, { memo } from "react";
import { areEqual } from "react-window";

import { getFaderId } from "./utils";
import {
  FaderContainer,
  FaderHeader,
  FaderContent,
  UserSplit as StyledUserSplit,
} from "./styled";
import { UserSplit } from "../types";

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
        >
          {`User ${userSplit.user + 1}`}
        </StyledUserSplit>
      )}
    </FaderContainer>
  );
}, areEqual);

export default FaderStrip;
