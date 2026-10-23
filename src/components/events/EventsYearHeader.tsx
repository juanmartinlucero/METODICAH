import React from 'react';
import { SectionGroupHeader } from '../common/SectionGroupHeader';

export interface EventsYearHeaderProps {
  yearKey: string;
  count: number;
}

export const EventsYearHeader: React.FC<EventsYearHeaderProps> = ({
  yearKey,
  count
}) => {
  return (
    <SectionGroupHeader
      title={yearKey}
      count={count}
      unitSingular="evento"
      unitPlural="eventos"
      color="#f59e0b"
    />
  );
};
