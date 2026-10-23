import React from 'react';
import { SectionGroupHeader } from '../common/SectionGroupHeader';

export interface EventsMonthHeaderProps {
  monthKey: string;
  count: number;
}

export const EventsMonthHeader: React.FC<EventsMonthHeaderProps> = ({
  monthKey,
  count
}) => {
  return (
    <SectionGroupHeader
      title={monthKey}
      count={count}
      unitSingular="evento"
      unitPlural="eventos"
      color="#f59e0b"
    />
  );
};
