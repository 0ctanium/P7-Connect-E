import { FC, RefObject, useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useScrollingUp } from 'hooks';
import { Avatar } from 'components/Avatar';

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

export const MobileTopBar: FC<{ contentRef: RefObject<HTMLElement> }> = ({
  contentRef,
}) => {
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
          setScrollPoint(scrollTop + 48);
        }
      }
    }
  }, [contentRef, isScrollingUp]);

  return (
    <>
      <div
        className="lg:hidden absolute w-full min-h-[4rem] pointer-events-none"
        style={{ height: scrollPoint }}>
        <div
          ref={barRef}
          className="sticky top-0 z-30 bg-white py-2 px-4 flex items-center justify-between sm:px-6 lg:px-8 pointer-events-auto">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="h-8 w-auto"
              src="/icons/icon-left-font.svg"
              alt="Workflow"
            />
          </div>
          <div>
            <Link href="/pages/profile">
              <a className="flex-shrink-0 w-full">
                <Avatar user={session?.user} size="md" />
                <div className="sr-only">
                  <p>{session?.user.name}</p>
                  <p>Account settings</p>
                </div>
              </a>
            </Link>
          </div>
        </div>
      </div>
      <div className="mb-16 lg:mb-0" />
    </>
  );
};
