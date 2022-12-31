import { useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import clsx from 'clsx'
import { AnimatePresence, motion, useIsPresent } from 'framer-motion'

import { Button } from '@/components/Button'
import { useIsInsideMobileNavigation } from '@/components/MobileNavigation'
import { useSectionStore } from '@/components/SectionProvider'
import { Tag } from '@/components/Tag'
import { remToPx } from '@/lib/remToPx'

function useInitialValue(value, condition = true) {
  let initialValue = useRef(value).current
  return condition ? initialValue : value
}

function TopLevelNavItem({ href, children }) {
  return (
    <li className="md:hidden">
      <Link
        href={href}
        className="block py-1 text-sm text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
      >
        {children}
      </Link>
    </li>
  )
}

function NavLink({ href, tag, active, isAnchorLink = false, children }) {
  let isInsideMobileNavigation = useIsInsideMobileNavigation()
  let [router, sections] = useInitialValue(
    [useRouter(), useSectionStore((s) => s.sections)],
    isInsideMobileNavigation
  )

  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={clsx(
        'flex justify-between gap-2 rounded-md py-1 px-3 text-sm transition',
        isAnchorLink ? 'pl-5' : '',
        isAnchorLink && href === router.pathname ? 'bg-gray-300' : '',
        active
          ? 'bg-red-50 font-bold text-red-500 dark:bg-red-200 dark:text-red-500'
          : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
      )}
    >
      <span className="truncate">{children}</span>
      {tag && (
        <Tag variant="small" color="zinc">
          {tag}
        </Tag>
      )}
    </Link>
  )
}

function VisibleSectionHighlight({ group, pathname }) {
  let [sections, visibleSections] = useInitialValue(
    [
      useSectionStore((s) => s.sections),
      useSectionStore((s) => s.visibleSections),
    ],
    useIsInsideMobileNavigation()
  )

  let isPresent = useIsPresent()
  let firstVisibleSectionIndex = Math.max(
    0,
    [{ id: '_top' }, ...sections].findIndex(
      (section) => section.id === visibleSections[0]
    )
  )
  let itemHeight = remToPx(2)
  let height = isPresent
    ? Math.max(1, visibleSections.length) * itemHeight
    : itemHeight
  let top =
    group.links.findIndex((link) => link.href === pathname) * itemHeight +
    firstVisibleSectionIndex * itemHeight

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 0.2 } }}
      exit={{ opacity: 0 }}
      className="absolute inset-x-0 top-0 bg-zinc-800/2.5 will-change-transform dark:bg-white/2.5"
      style={{ borderRadius: 8, height, top }}
    />
  )
}

function ActivePageMarker({ group, pathname }) {
  let itemHeight = remToPx(2)
  let offset = remToPx(0.25)
  let activePageIndex = group.links.findIndex((link) => link.href === pathname)
  let top = offset + activePageIndex * itemHeight

  return (
    <motion.div
      layout
      className="absolute left-2 h-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 0.2 } }}
      exit={{ opacity: 0 }}
      style={{ top }}
    />
  )
}

function NavigationGroup({ group, className }) {
  // If this is the mobile navigation then we always render the initial
  // state, so that the state does not change during the close animation.
  // The state will still update when we re-open (re-render) the navigation.
  let isInsideMobileNavigation = useIsInsideMobileNavigation()
  let [router, sections] = useInitialValue(
    [useRouter(), useSectionStore((s) => s.sections)],
    isInsideMobileNavigation
  )

  let isActiveGroup =
    group.links.findIndex((link) => link.href === router.pathname) !== -1

  return (
    <li className={clsx('relative mt-6', className)}>
      <motion.h2
        layout="position"
        className="text-xs px-3 font-semibold text-zinc-900 dark:text-white"
      >
        {group.title}
      </motion.h2>
      <div className="relative mt-3">
        <ul role="list">
          {group.links.map((link) => (
            <motion.li key={link.href} layout="position" className="relative">
              <NavLink href={link.href} active={link.href === router.pathname}>
                {link.title}
              </NavLink>
              <AnimatePresence mode="popLayout" initial={false}>
                {link.href === router.pathname && sections.length > 0 && (
                  <motion.ul
                    className="relative"
                    role="list"
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: 1,
                      transition: { delay: 0.1 },
                    }}
                    exit={{
                      opacity: 0,
                      transition: { duration: 0.15 },
                    }}
                  >
                    {sections.map((section) => (
                      <li key={section.id} className="my-1">
                        <NavLink
                          href={`${link.href}#${section.id}`}
                          tag={section.tag}
                          isAnchorLink
                        >
                          {section.title}
                        </NavLink>
                        <motion.div
                          layout
                          className="absolute inset-y-0 left-2 w-px bg-gray-200 dark:bg-white/5"
                        />
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </motion.li>
          ))}
        </ul>
      </div>
    </li>
  )
}

export const navigation = [
  {
    links: [{ title: 'API Docs', href: '/' }],
  },
  {
    title: 'RELEASE NOTE',
    links: [{ title: "🎉 What's New", href: '/whats-new' }],
  },
  {
    title: 'OMNIA',
    links: [
      { title: 'Overview', href: '/overview' },
      { title: 'Softphone Park Feature', href: '/softphone-park-feature' },
      { title: 'Call Recordings', href: '/call-recordings' },
      { title: 'Push Notifications', href: '/push-notifications' },
      { title: 'Hot Keys', href: '/hot-keys' },
      { title: 'Voicemail Management', href: '/voicemail-management' },
      { title: 'Call Summary', href: '/call-summary' },
      { title: 'Time Zone Settings', href: '/time-zone-settings' },
      { title: 'Volume Controls', href: '/volume-controls' },
      { title: 'Queue Statistics', href: '/queue-statistics' },
      { title: 'Queue Manager Dashboard', href: '/queue-manager-dashboard' },
    ],
  },
  {
    title: 'GENERAL',
    links: [
      {
        title: 'How to Connect Yealink Phone to Wifi',
        href: '/how-to-connect-yealink-phone-to-wifi',
      },
      {
        title: 'How to Call Into a Conference Room',
        href: '/how-to-call-into-a-conference-room',
      },
      {
        title: 'Headset Issue: Cannot Hear / Be Heard',
        href: '/headset-issue-cannot-hear-be-heard',
      },
      {
        title: 'Updating Yealink Firmware',
        href: '/updating-yealink-firmware',
      },
      { title: 'SMS 10DLC Update', href: '/sms-10dlc-update' },
      {
        title: 'How to Allow Notifications',
        href: '/how-to-allow-notifications',
      },
      { title: 'Firewall IP whitelist', href: '/firewall-ip-whitelist' },
      { title: 'Mobile App DoNotDisturb', href: '/mobile-app-donotdisturb' },
      {
        title: 'Downloading VOXO to Desktop',
        href: '/downloading-voxo-to-desktop',
      },
      { title: 'Send a fax via email', href: '/send-a-fax-via-email' },
      { title: 'How To: Set Up Voicemail', href: '/how-to-set-up-voicemail' },
      {
        title: 'Invite a user to VOXO Mobile',
        href: '/invite-a-user-to-voxo-mobile',
      },
      {
        title: 'How To: Conference Call (VOXO Meet)',
        href: '/how-to-conference-call-voxo-meet',
      },
      { title: 'How To: Transfer a Call', href: '/how-to-transfer-a-call' },
      { title: 'Add a Speed Dial Contact', href: '/add-a-speed-dial-contact' },
      {
        title: 'How To: Factory Reset (Polycom 400 series)',
        href: '/how-to-factory-reset-polycom-400-series',
      },
      {
        title: "How do Time of Day's work?",
        href: '/how-do-time-of-days-work',
      },
      {
        title: 'How to: Factory reset (Yealink series)',
        href: '/how-to-factory-reset-yealink-series',
      },
      { title: 'Pause and DND in OMNIA', href: '/pause-and-dnd-in-omnia' },
    ],
  },
]

export function Navigation(props) {
  return (
    <nav {...props}>
      <ul role="list">
        {navigation.map((group, groupIndex) => (
          <NavigationGroup
            key={group.title}
            group={group}
            className={groupIndex === 0 && 'md:mt-0'}
          />
        ))}
      </ul>
    </nav>
  )
}
