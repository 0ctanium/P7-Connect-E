import { FC, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { SideBar, SideNav } from './desktop';
import { MobileTopBar, BottomNav } from './mobile';

export const Layout: FC<{ sideBar?: JSX.Element; current: string }> = ({
  children,
  current: currentRoute,
  sideBar,
}) => {
  const content = useRef<HTMLElement>(null);
  const [current, setCurrent] = useState(currentRoute);
  const { data } = useSession();

  if (!data) {
    return null;
  }
  const { user } = data;

  return (
    <>
      <div className="h-full flex">
        {/* Static sidebar for desktop */}
        <SideNav current={current} onCurrentChange={setCurrent} />

        <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
          <main className="flex-1 flex overflow-hidden">
            {/* Primary column */}
            <section
              ref={content}
              aria-labelledby="primary-heading"
              className="relative  min-w-0 flex-1 h-full flex flex-col overflow-y-auto lg:order-last">
              {/* Mobile top bar */}
              <MobileTopBar contentRef={content} />

              <h1 id="primary-heading" className="sr-only">
                Account
              </h1>

              {children}
            </section>

            {/* Secondary column (hidden on smaller screens) */}
            <aside className="hidden lg:block lg:flex-shrink-0 lg:order-first">
              <div className="h-full relative flex flex-col w-96 border-r border-gray-200 bg-white overflow-y-auto">
                {sideBar || <SideBar current={current} />}
              </div>
            </aside>
          </main>

          {/* Mobile bottom navigation */}
          <BottomNav current={currentRoute} />
        </div>
      </div>
    </>
  );
};
