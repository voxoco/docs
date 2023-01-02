import { forwardRef, Fragment } from 'react'
import Link from 'next/link'
import clsx from 'clsx'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'

import { Button } from '@/components/Button'
import { Logo } from '@/components/Logo'
import {
  MobileNavigation,
  useIsInsideMobileNavigation,
} from '@/components/MobileNavigation'
import { useMobileNavigationStore } from '@/components/MobileNavigation'
import { ModeToggle } from '@/components/ModeToggle'
import { MobileSearch, Search } from '@/components/Search'
import Image from 'next/image'

function TopLevelNavItem({ href, children }) {
  return (
    <li>
      <Link
        href={href}
        className="text-sm leading-5 text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
      >
        {children}
      </Link>
    </li>
  )
}

export const Header = forwardRef(function Header({ className }, ref) {
  let { isOpen: mobileNavIsOpen } = useMobileNavigationStore()
  let isInsideMobileNavigation = useIsInsideMobileNavigation()

  let { scrollY } = useScroll()
  let bgOpacityLight = useTransform(scrollY, [0, 72], [0.5, 0.9])
  let bgOpacityDark = useTransform(scrollY, [0, 72], [0.2, 0.8])

  return (
    <motion.div
      ref={ref}
      className={clsx(
        className,
        'fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-between gap-12 px-4 transition sm:px-6 md:h-20 lg:z-30 lg:px-8',
        !isInsideMobileNavigation && 'backdrop-blur-sm dark:backdrop-blur',
        isInsideMobileNavigation
          ? 'bg-white dark:bg-zinc-900'
          : 'bg-white/[var(--bg-opacity-light)] dark:bg-zinc-900/[var(--bg-opacity-dark)]'
      )}
      style={{
        '--bg-opacity-light': bgOpacityLight,
        '--bg-opacity-dark': bgOpacityDark,
      }}
    >
      <div
        className={clsx(
          'absolute inset-x-0 top-full h-px transition',
          (isInsideMobileNavigation || !mobileNavIsOpen) &&
            'bg-zinc-900/7.5 dark:bg-white/7.5'
        )}
      />

      <div className="flex items-center">
        <div className="flex items-center gap-5 lg:hidden">
          <MobileNavigation />
        </div>
        <Link href="/" aria-label="Home">
          <div className="flex items-center">
            <div className="relative mr-4 h-6 w-6 md:h-10 md:w-10">
              <Image src="/images/icons/logo.png" fill />
            </div>
            <span className="text-base font-bold text-black hover:text-red-500 dark:text-white dark:hover:text-red-500 md:text-xl">
              VOXO Docs
            </span>
          </div>
        </Link>
        <div className="hidden md:block">
          <Menu as="div" className="relative inline-block text-left">
            {({ open }) => (
              <>
                <div>
                  <Menu.Button
                    className={`${
                      open ? 'text-red-500' : ''
                    } inline-flex w-full items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-gray-900 hover:text-red-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 dark:text-white dark:hover:text-red-500`}
                  >
                    Support...
                    <ChevronDownIcon
                      className={`${
                        open ? 'rotate-180' : 'rotate-0'
                      } ml-2 -mr-1 h-5 w-5 duration-150`}
                      aria-hidden="true"
                    />
                  </Menu.Button>
                </div>
                <Transition
                  show={open}
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 mt-2 w-max origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="px-1 py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={`${
                              active
                                ? 'bg-gray-100 text-gray-900'
                                : 'text-gray-500'
                            } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                          >
                            API Docs
                          </button>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={`${
                              active
                                ? 'bg-gray-100 text-gray-900'
                                : 'text-gray-500'
                            } group flex w-full items-center gap-x-2 rounded-md px-2 py-2 text-sm`}
                          >
                            Support Docs{' '}
                            <span className="font-normal text-gray-400 tracking-wider">
                              MAIN
                            </span>
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </>
            )}
          </Menu>
        </div>
      </div>

      <div className="flex items-center gap-x-4">
        <div className="hidden md:block">
          <Link
            href="/"
            className="text-base font-bold text-red-500 hover:text-red-800"
          >
            Go to Omnia
          </Link>
        </div>

        <ModeToggle />
        <MobileSearch />
        <Search />
      </div>
    </motion.div>
  )
})
