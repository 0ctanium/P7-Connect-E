import React, { FC, HTMLProps, useMemo } from 'react';
import moment, { MomentInput } from 'moment';
import { Tooltip } from 'components/Tooltip';

export const PostDate: FC<
  { date: MomentInput } & HTMLProps<HTMLParagraphElement>
> = ({ date, ...props }) => {
  const calendar = useMemo(
    () =>
      moment(date).calendar({
        lastDay: '[hier à] LT',
        sameDay: 'LT',
        nextDay: '[demain à] LT',
        nextWeek: 'dddd [prochain à] LT',
        lastWeek: 'dddd [dernier à] LT',
        sameElse: function (now) {
          if (moment(this as MomentInput).year() != moment(now).year()) {
            return 'D MMMM YYYY';
          } else {
            return '[le] D MMMM [à] LT';
          }
        },
      }),
    [date]
  );
  const completeDate = useMemo(
    () => moment(date).format('[le] dddd D MMMM YYYY [à] LT'),
    [date]
  );

  return (
    <Tooltip
      render={completeDate}
      className="tooltip-border-transparent tooltip-bg-gray-900/80 text-white text-xs font-light"
      config={{ delayShow: 200 }}>
      <p {...props}>{calendar}</p>
    </Tooltip>
  );
};
