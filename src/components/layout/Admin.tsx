import {FC, Fragment, HTMLAttributes, PropsWithChildren, ReactNode, useState} from 'react'
import { Dialog, Transition } from '@headlessui/react'
import {
  HiHome as HomeIcon,
  HiFlag as FlagIcon,
  HiMenu as MenuIcon,
  HiUsers as UsersIcon,
  HiX as XIcon,
  HiViewGrid as ViewGridIcon
} from 'react-icons/hi'
import clsx from "clsx";
import Link from 'next/link';
import {useSession} from "next-auth/react";
import {LoadingSpinner} from "../LoadingSpinner";

const navigation = [
  { id: 'home', name: 'Accueil', href: '/admin', icon: HomeIcon },
  { id: 'groups', name: 'Groupes', href: '/admin/groups', icon: ViewGridIcon },
  { id: 'users', name: 'Utilisateurs', href: '/admin/users', icon: UsersIcon },
  // { id: 'moderation', name: 'Signalements', href: '/admin/moderation', icon: FlagIcon },
  // { name: 'Reports', href: '/admin/analytics', icon: ChartBarIcon, current: false },
]

export const AdminLayout: FC<{ current: string, loading?: boolean }> = ({ children, loading, current }) => {
  const { data, status } = useSession()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
      <>
        <div className="min-h-full">
          <Transition.Root show={sidebarOpen} as={Fragment}>
            <Dialog as="div" className="fixed inset-0 flex z-40 md:hidden" onClose={setSidebarOpen}>
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
                <div className="relative flex-1 flex flex-col max-w-xs w-full bg-gray-800">
                  <Transition.Child
                      as={Fragment}
                      enter="ease-in-out duration-300"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                      leave="ease-in-out duration-300"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                  >
                    <div className="absolute top-0 right-0 -mr-12 pt-2">
                      <button
                          type="button"
                          className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                          onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Fermer la barre latérale</span>
                        <XIcon className="h-6 w-6 text-white" aria-hidden="true" />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                    <div className="flex-shrink-0 flex items-center px-4">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                          className="h-8 w-auto"
                          src="/icons/icon-left-font-monochrome-white.svg"
                          alt="Workflow"
                      />
                    </div>
                    <nav className="mt-5 px-2 space-y-1">
                      {navigation.map((item) => (
                          <Link
                              key={item.name}
                              href={item.href}
                          >
                            <a className={clsx(
                                item.id === current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                'group flex items-center px-2 py-2 text-base font-medium rounded-md'
                            )}>
                              <item.icon
                                  className={clsx(
                                      item.id === current ? 'text-gray-300' : 'text-gray-400 group-hover:text-gray-300',
                                      'mr-4 flex-shrink-0 h-6 w-6'
                                  )}
                                  aria-hidden="true"
                              />
                              {item.name}
                            </a>
                          </Link>
                      ))}
                    </nav>
                  </div>
                  <div className="flex-shrink-0 flex bg-gray-700 p-4">
                    <a href="#" className="flex-shrink-0 group block">
                      <div className="flex items-center">
                        <div>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                              className="inline-block h-10 w-10 rounded-full"
                              // TODO: add placeholder image
                              src={data?.user.image || ''}
                              alt=""
                          />
                        </div>
                        <div className="ml-3">
                          <p className="text-base font-medium text-white">{data?.user.name}</p>
                          <p className="text-sm font-medium text-gray-400 group-hover:text-gray-300">Accéder au profil</p>
                        </div>
                      </div>
                    </a>
                  </div>
                </div>
              </Transition.Child>
              <div className="flex-shrink-0 w-14">{/* Force sidebar to shrink to fit close icon */}</div>
            </Dialog>
          </Transition.Root>

          {/* Static sidebar for desktop */}
          <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
            {/* Sidebar components, swap this element with another sidebar if you like */}
            <div className="flex-1 flex flex-col min-h-0 bg-gray-800">
              <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
                <div className="flex items-center flex-shrink-0 px-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                      className="h-8 w-auto"
                      src="/icons/icon-left-font-monochrome-white.svg"
                      alt="Workflow"
                  />
                </div>
                <nav className="mt-5 flex-1 px-2 space-y-1">
                  {navigation.map((item) => (
                      <Link
                          key={item.name}
                          href={item.href}
                      >
                        <a className={clsx(
                            item.id === current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                            'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                        )}>
                          <item.icon
                              className={clsx(
                                  item.id === current ? 'text-gray-300' : 'text-gray-400 group-hover:text-gray-300',
                                  'mr-3 flex-shrink-0 h-6 w-6'
                              )}
                              aria-hidden="true"
                          />
                          {item.name}
                        </a>
                      </Link>
                  ))}
                </nav>
              </div>
              <div className="flex-shrink-0 flex bg-gray-700 p-4">
                <a href="#" className="flex-shrink-0 w-full group block">
                  <div className="flex items-center">
                    <div>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                          className="inline-block h-9 w-9 rounded-full"
                          // TODO: add placeholder image
                          src={data?.user.image || ''}
                          alt=""
                      />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-white">{data?.user.name}</p>
                      <p className="text-xs font-medium text-gray-300 group-hover:text-gray-200">Accéder au profil</p>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>

          <div className="md:pl-64 flex flex-col flex-1 min-h-full">
            <div className="sticky top-0 z-10 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-gray-100">
              <button
                  type="button"
                  className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                  onClick={() => setSidebarOpen(true)}
              >
                <span className="sr-only">Ouvrir la barre latérale</span>
                <MenuIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <main className="flex-1 min-h-full">
              <div className="py-6 space-y-6 min-h-full">
                {status === 'loading' || loading ? (
                    <div className="min-h-full flex justify-center items-center">
                      <LoadingSpinner />
                    </div>
                ): children}
              </div>
            </main>
          </div>
        </div>
      </>
  )
}

export const AdminLayoutSection = <Tag extends HTMLElement = HTMLElement>({ as: Component = "div", children, ...props }: PropsWithChildren<HTMLAttributes<Tag> & { as?: ReactNode }>): JSX.Element => {
  // @ts-ignore
  return <Component className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8" {...props}>{children}</Component>
}

export const AdminLayoutHeader: FC<{ title: string, desc?: string, actions?: JSX.Element}> = ({ title, desc, actions}) => {
  return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
          {desc && <p className="mt-2 text-sm text-gray-700">{desc}</p>}
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          {actions}
        </div>
      </div>
  )
}
