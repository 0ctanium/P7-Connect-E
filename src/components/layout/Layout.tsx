import {FC, Fragment, RefObject, useEffect, useMemo, useRef, useState} from 'react'
import { Dialog, Transition } from '@headlessui/react'
import {
  HiX as XIcon,

  HiHome as HomeIcon,
  HiChat as ChatIcon,
  HiUserGroup as UserGroupIcon,
  HiBell as BellIcon,

  HiOutlineHome as HomeIconOutline,
  HiOutlineChat as ChatIconOutline,
  HiOutlineUserGroup as UserGroupIconOutline,
  HiOutlineBell as BellIconOutline,
} from 'react-icons/hi'
import {useSession} from "next-auth/react";
import Link from 'next/link';
import { useScrollingUp } from "hooks";
import clsx from "clsx";


const navigation = [
  { id: 'feed', name: "Fil d'actualités", href: '/', icon: HomeIconOutline, currentIcon: HomeIcon },
  { id: 'notifications', name: 'Notifications', href: '/notifications', icon: BellIconOutline, currentIcon: BellIcon },
  { id: 'chats', name: 'Discussions', href: '/chats', icon: ChatIconOutline, currentIcon: ChatIcon },

]

const mobileNavigation = [
  { id: 'feed', name: "Fil d'actualités", href: '/', icon: HomeIconOutline, currentIcon: HomeIcon },
  { id: 'groups', name: 'Groupes', href: '/groups', icon: UserGroupIconOutline, currentIcon: UserGroupIcon },
  { id: 'chat', name: 'Discussions', href: '/chats', icon: ChatIconOutline, currentIcon: ChatIcon },
  { id: 'notifications', name: 'Notifications', href: '/notifications', icon: BellIconOutline, currentIcon: BellIcon },
]

export const Layout: FC<{ sideBar?: JSX.Element, current: string }> = ({ children, current, sideBar }) => {
  const content = useRef<HTMLElement>(null)
  const { data } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  if(!data) { return null }
  const { user } = data

  return (
      <>
        <div className="h-full flex">
          <Transition.Root show={mobileMenuOpen} as={Fragment}>
            <Dialog as="div" className="fixed inset-0 flex z-40 lg:hidden" onClose={setMobileMenuOpen}>
              <Transition.Child
                  as={Fragment}
                  enter="transition-opacity ease-linear duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="transition-opacity ease-linear duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
              >
                <Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-75" />
              </Transition.Child>
              <Transition.Child
                  as={Fragment}
                  enter="transition ease-in-out duration-300 transform"
                  enterFrom="-translate-x-full"
                  enterTo="translate-x-0"
                  leave="transition ease-in-out duration-300 transform"
                  leaveFrom="translate-x-0"
                  leaveTo="-translate-x-full"
              >
                <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white focus:outline-none">
                  <Transition.Child
                      as={Fragment}
                      enter="ease-in-out duration-300"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                      leave="ease-in-out duration-300"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                  >
                    <div className="absolute top-0 right-0 -mr-12 pt-4">
                      <button
                          type="button"
                          className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                          onClick={() => setMobileMenuOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XIcon className="h-6 w-6 text-white" aria-hidden="true" />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="pt-5 pb-4">
                    <div className="flex-shrink-0 flex items-center px-4">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                          className="h-8 w-auto"
                          src="/icons/icon.svg"
                          alt="Workflow"
                      />
                    </div>
                    <nav aria-label="Sidebar" className="mt-5">
                      <div className="px-2 space-y-1">
                        {navigation.map((item) => (
                            <a
                                key={item.name}
                                href={item.href}
                                className="group p-2 rounded-md flex items-center text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            >
                              <item.icon
                                  className="mr-4 h-6 w-6 text-gray-400 group-hover:text-gray-500"
                                  aria-hidden="true"
                              />
                              {item.name}
                            </a>
                        ))}
                      </div>
                    </nav>
                  </div>
                  <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
                    <a href="#" className="flex-shrink-0 group block">
                      <div className="flex items-center">
                        <div>
                          {/* TODO: add image placeholder*/}
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img className="inline-block h-10 w-10 rounded-full" src={user.image || ''} alt="" />
                        </div>
                        <div className="ml-3">
                          <p className="text-base font-medium text-gray-700 group-hover:text-gray-900">{user.name}</p>
                          <p className="text-sm font-medium text-gray-500 group-hover:text-gray-700">Account Settings</p>
                        </div>
                      </div>
                    </a>
                  </div>
                </div>
              </Transition.Child>
              <div className="flex-shrink-0 w-14" aria-hidden="true">
                {/* Force sidebar to shrink to fit close icon */}
              </div>
            </Dialog>
          </Transition.Root>

          {/* Static sidebar for desktop */}
          <div className="hidden lg:flex lg:flex-shrink-0">
            <div className="flex flex-col w-20">
              <div className="flex-1 flex flex-col min-h-0 overflow-y-auto bg-indigo-600">
                <div className="flex-1">
                  <div className="py-4 flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        className="h-8 w-auto"
                        src="/icons/icon.svg"
                        alt="Workflow"
                    />
                  </div>
                  <nav aria-label="Sidebar" className="py-6 flex flex-col items-center space-y-3">
                    {navigation.map((item) => (
                        <a
                            key={item.name}
                            href={item.href}
                            className="flex items-center p-4 rounded-lg text-indigo-200 hover:bg-indigo-700"
                        >
                          {item.id === current ? <item.currentIcon className="h-6 w-6" aria-hidden="true" /> : <item.icon className="h-6 w-6" aria-hidden="true" />}
                          <span className="sr-only">{item.name}</span>
                        </a>
                    ))}
                  </nav>
                </div>
                <div className="flex-shrink-0 flex pb-5">
                  <Link href="/profile">
                    <a className="flex-shrink-0 w-full">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img className="block mx-auto h-10 w-10 rounded-full" src={user.image || ''} alt="" />
                      <div className="sr-only">
                        <p>{user.name}</p>
                        <p>Account settings</p>
                      </div>
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
            <main className="flex-1 flex overflow-hidden">
              {/* Primary column */}
              <section
                  ref={content}
                  aria-labelledby="primary-heading"
                  className="relative  min-w-0 flex-1 h-full flex flex-col overflow-y-auto lg:order-last"
              >
                {/* Mobile top bar */}
                <MobileTopBar contentRef={content} />

                <h1 id="primary-heading" className="sr-only">
                  Account
                </h1>

                {children}
              </section>

              {/* Secondary column (hidden on smaller screens) */}
              {sideBar && (
                  <aside className="hidden lg:block lg:flex-shrink-0 lg:order-first">
                    <div className="h-full relative flex flex-col w-96 border-r border-gray-200 bg-white overflow-y-auto">
                      {sideBar}
                    </div>
                  </aside>
              )}
            </main>

            {/* Mobile bottom navigation */}
            <div className="lg:hidden">
              <div className="bg-indigo-600 py-2 px-4 sm:px-6 lg:px-8">
                <nav className="mx-auto md:max-w-md sm:max-w-sm max-w-xs flex flex-row items-center justify-between">
                  {mobileNavigation.map((item) => (
                      <a
                          key={item.name}
                          href={item.href}
                          className="h-12 w-12 inline-flex items-center justify-center bg-indigo-600 rounded-md text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                      >

                          {item.id === current ? <item.currentIcon className="h-6 w-6" aria-hidden="true" /> : <item.icon className="h-6 w-6" aria-hidden="true" />}
                        <span className="sr-only">{item.name}</span>
                      </a>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        </div>
      </>
  )
}

const isElementXPercentInViewport = function(el: HTMLElement, percentVisible: number) {
  let
      rect = el.getBoundingClientRect(),
      windowHeight = (window.innerHeight || document.documentElement.clientHeight);

  return !(
      Math.floor(100 - (((rect.top >= 0 ? 0 : rect.top) / +-rect.height) * 100)) < percentVisible ||
      Math.floor(100 - ((rect.bottom - windowHeight) / rect.height) * 100) < percentVisible
  )
};

const MobileTopBar: FC<{ contentRef: RefObject<HTMLElement> }> = ({ contentRef }) => {
  const { data } = useSession()

  const barRef = useRef<HTMLElement | null>(null)
  const isScrollingUp = useScrollingUp(contentRef)
  const [scrollPoint, setScrollPoint] = useState(0)

  useEffect(() => {
    const el = contentRef?.current
    const bar = barRef?.current
    const scrollTop = el?.scrollTop as number

    if(bar && el) {
      const bounding = bar.getBoundingClientRect()
      const view = bounding.top >= 0 && bounding.left >= 0 && bounding.right <= window.innerWidth && bounding.bottom <= window.innerHeight


      if(isScrollingUp) {
        if(!isElementXPercentInViewport(bar ,0)) {
          setScrollPoint(scrollTop)
        }
      } else {
        if(view) {
          setScrollPoint(scrollTop + 48)
        }
      }
    }
  }, [contentRef, isScrollingUp])

  return (
      <>
        <div className={clsx('lg:hidden absolute w-full min-h-[3rem]' )} style={{ 'height': scrollPoint }}>
          <div ref={barRef} className="sticky top-0   bg-white py-2 px-4 flex items-center justify-between sm:px-6 lg:px-8">
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                  className="h-8 w-auto"
                  src="/icons/icon-left-font.svg"
                  alt="Workflow"
              />
            </div>
            <div>
              <a className="flex-shrink-0 w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="block mx-auto h-8 w-8 rounded-full" src={data?.user.image || ''} alt="" />
                <div className="sr-only">
                  <p>{data?.user.name}</p>
                  <p>Account settings</p>
                </div>
              </a>
            </div>
          </div>
        </div>
        <div className="mb-12 lg:mb-0" />
      </>
  )
}
