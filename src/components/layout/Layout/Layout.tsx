import { FC, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { SideBar, SideNav } from './desktop';
import { MobileTopBar, BottomNav } from './mobile';
import { LayoutProps } from '../../../types';
import {
  NavigationPage,
  parseCurrentNavToDesktop,
  parseCurrentNavToMobile,
} from '../../../constants/navigation';

export const Layout: FC<LayoutProps> = ({
  children,
  current: currentRoute,
  title,
  showTitle,
}) => {
  const content = useRef<HTMLElement>(null);
  const [current, setCurrent] = useState<NavigationPage>(currentRoute);
  const { data } = useSession();

  if (!data) {
    return null;
  }
  const { user } = data;
  const mobileNav = parseCurrentNavToMobile(currentRoute);
  const desktopNav = parseCurrentNavToDesktop(current);

  return (
    <>
      <div className="h-full flex">
        {/* Static sidebar for desktop */}
        <SideNav current={desktopNav} onCurrentChange={setCurrent} />

        <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
          <main className="flex-1 flex overflow-hidden">
            {/* Primary column */}
            <section
              id="main-layout"
              ref={content}
              aria-labelledby="primary-heading"
              className="relative  min-w-0 flex-1 h-full flex flex-col overflow-y-auto lg:order-last">
              {/* Mobile top bar */}
              <MobileTopBar
                contentRef={content}
                title={title}
                showTitle={showTitle}
              />

              <h1 id="primary-heading" className="sr-only">
                Account
              </h1>

              {children}
            </section>

            {/* Secondary column (hidden on smaller screens) */}
            <aside className="hidden lg:block lg:flex-shrink-0 lg:order-first">
              <div className="h-full relative flex flex-col w-96 border-r border-gray-200 bg-white overflow-y-auto">
                <SideBar current={desktopNav} />
              </div>
            </aside>
          </main>

          {/* Mobile bottom navigation */}
          <BottomNav current={mobileNav} />
        </div>
      </div>
    </>
  );
};
