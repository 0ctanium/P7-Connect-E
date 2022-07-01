import { FC, RefObject, useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useScrollingUp } from 'hooks';
import { Avatar } from 'components/Avatar';
import { LogoIcon, LogoText } from 'components/Logo';
import { Dropdown } from 'components/Dropdown';
import { userDropDown } from '../../../../constants/navigation';

const isElementXPercentInViewport = function (
  el: HTMLElement,
  percentVisible: number
) {
  let rect = el.getBoundingClientRect(),
    windowHeight = window.innerHeight || document.documentElement.clientHeight;

  return !(
    Math.floor(100 - ((rect.top >= 0 ? 0 : rect.top) / +-rect.height) * 100) <
      percentVisible ||
    Math.floor(100 - ((rect.bottom - windowHeight) / rect.height) * 100) <
      percentVisible
  );
};

const barHeight = 56;
export const MobileTopBar: FC<{
  contentRef: RefObject<HTMLElement>;
  title?: string;
  showTitle?: boolean;
}> = ({ contentRef, title }) => {
  const { data: session } = useSession<true>({ required: true });

  const barRef = useRef<HTMLDivElement>(null);
  const isScrollingUp = useScrollingUp(contentRef);
  const [scrollPoint, setScrollPoint] = useState(0);

  useEffect(() => {
    const el = contentRef?.current;
    const bar = barRef?.current;
    const scrollTop = el?.scrollTop as number;

    if (bar && el) {
      const bounding = bar.getBoundingClientRect();
      const view =
        bounding.top >= 0 &&
        bounding.left >= 0 &&
        bounding.right <= window.innerWidth &&
        bounding.bottom <= window.innerHeight;

      if (isScrollingUp) {
        if (!isElementXPercentInViewport(bar, 0)) {
          setScrollPoint(scrollTop);
        }
      } else {
        if (view) {
          setScrollPoint(scrollTop + barHeight);
        }
      }
    }
  }, [contentRef, isScrollingUp]);

  return (
    <>
      <div
        className="lg:hidden absolute w-full pointer-events-none"
        style={{ height: scrollPoint, minHeight: barHeight }}>
        <div
          ref={barRef}
          className="sticky top-0 z-30 bg-white py-2 px-4 flex items-center justify-between sm:px-6 lg:px-8 pointer-events-auto">
          {title ? (
            <h1 className="text-2xl font-bold">{title}</h1>
          ) : (
            <div className="flex items-center h-8 w-full">
              <LogoIcon className="fill-indigo-600 h-full mr-2" />
              <LogoText className="fill-gray-900 h-[60%]" />
            </div>
          )}
          {/*<Link href="/profile">*/}
          <Dropdown
            menu={userDropDown}
            placement="bottom-right"
            className="flex">
            <Avatar user={session?.user} />
            <div className="sr-only">
              <p>{session?.user.name}</p>
              <p>Account settings</p>
            </div>
          </Dropdown>
          {/*</Link>*/}
        </div>
      </div>
      <div style={{ marginBottom: barHeight }} className="lg:!mb-0" />
    </>
  );
};
