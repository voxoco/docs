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
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={clsx(
        'flex justify-between gap-2 py-1 pr-3 text-sm transition',
        isAnchorLink ? 'pl-7' : 'pl-4',
        active
          ? 'text-zinc-900 dark:text-white'
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
      className="absolute left-2 h-6 w-px bg-emerald-500"
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
        className="text-xs font-semibold text-zinc-900 dark:text-white"
      >
        {group.title}
      </motion.h2>
      <div className="relative mt-3 pl-2">
        <AnimatePresence initial={!isInsideMobileNavigation}>
          {isActiveGroup && (
            <VisibleSectionHighlight group={group} pathname={router.pathname} />
          )}
        </AnimatePresence>
        <motion.div
          layout
          className="absolute inset-y-0 left-2 w-px bg-zinc-900/10 dark:bg-white/5"
        />
        <AnimatePresence initial={false}>
          {isActiveGroup && (
            <ActivePageMarker group={group} pathname={router.pathname} />
          )}
        </AnimatePresence>
        <ul role="list" className="border-l border-transparent">
          {group.links.map((link) => (
            <motion.li key={link.href} layout="position" className="relative">
              <NavLink href={link.href} active={link.href === router.pathname}>
                {link.title}
              </NavLink>
              <AnimatePresence mode="popLayout" initial={false}>
                {link.href === router.pathname && sections.length > 0 && (
                  <motion.ul
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
                      <li key={section.id}>
                        <NavLink
                          href={`${link.href}#${section.id}`}
                          tag={section.tag}
                          isAnchorLink
                        >
                          {section.title}
                        </NavLink>
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
    title: 'API Docs',
    links: [{ title: 'API Docs', href: '/voxo-public' }],
  },
  {
    title: 'RELEASE NOTES',
    links: [
      { title: "🎉 What's New", href: '/voxo-public/release-notes/whats-new' },
    ],
  },
  {
    title: 'OMNIA',
    links: [
      { title: 'Overview', href: '/voxo-public/omnia/overview' },
      {
        title: 'Softphone Park Feature',
        href: '/voxo-public/omnia/softphone-park-feature',
      },
      { title: 'Call Recordings', href: '/voxo-public/omnia/call-recordings' },
      {
        title: 'Push Notifications',
        href: '/voxo-public/omnia/push-notifications',
      },
      { title: 'Hot Keys', href: '/voxo-public/omnia/hot-keys' },
      {
        title: 'Voicemail Management',
        href: '/voxo-public/omnia/voicemail-management',
      },
      { title: 'Call Summary', href: '/voxo-public/omnia/call-summary' },
      {
        title: 'Time Zone Settings',
        href: '/voxo-public/omnia/time-zone-settings',
      },
      { title: 'Volume Controls', href: '/voxo-public/omnia/volume-controls' },
      {
        title: 'Queue Statistics',
        href: '/voxo-public/omnia/queue-statistics',
      },
      {
        title: 'Queue Manager Dashboard',
        href: '/voxo-public/omnia/queue-manager-dashboard',
      },
    ],
  },
  {
    title: 'GENERAL',
    links: [
      {
        title: 'How to Connect Yealink Phone to Wifi',
        href: '/voxo-public/general/how-to-connect-yealink-phone-to-wifi',
      },
      {
        title: 'How to Call Into a Conference Room',
        href: '/voxo-public/general/how-to-call-into-a-conference-room',
      },
      {
        title: 'Headset Issue: Cannot Hear / Be Heard',
        href: '/voxo-public/general/headset-issue-cannot-hear-be-heard',
      },
      {
        title: 'Updating Yealink Firmware',
        href: '/voxo-public/general/updating-yealink-firmware',
      },
      {
        title: 'SMS 10DLC Update',
        href: '/voxo-public/general/sms-10dlc-update',
      },
      {
        title: 'How to Allow Notifications',
        href: '/voxo-public/general/how-to-allow-notifications',
      },
      {
        title: 'Firewall IP whitelist',
        href: '/voxo-public/general/firewall-ip-whitelist',
      },
      {
        title: 'Mobile App DoNotDisturb',
        href: '/voxo-public/general/mobile-app-donotdisturb',
      },
      {
        title: 'Downloading VOXO to Desktop',
        href: '/voxo-public/general/downloading-voxo-to-desktop',
      },
      {
        title: 'Send a fax via email',
        href: '/voxo-public/general/send-a-fax-via-email',
      },
      {
        title: 'How To: Set Up Voicemail',
        href: '/voxo-public/general/how-to-set-up-voicemail',
      },
      {
        title: 'Invite a user to VOXO Mobile',
        href: '/voxo-public/general/invite-a-user-to-voxo-mobile',
      },
      {
        title: 'How To: Conference Call (VOXO Meet)',
        href: '/voxo-public/general/how-to-conference-call-voxo-meet',
      },
      {
        title: 'How To: Transfer a Call',
        href: '/voxo-public/general/how-to-transfer-a-call',
      },
      {
        title: 'Add a Speed Dial Contact',
        href: '/voxo-public/general/add-a-speed-dial-contact',
      },
      {
        title: 'How To: Factory Reset (Polycom 400 series)',
        href: '/voxo-public/general/how-to-factory-reset-polycom-400-series',
      },
      {
        title: "How do Time of Day's work?",
        href: '/voxo-public/general/how-do-time-of-days-work',
      },
      {
        title: 'How to: Factory reset (Yealink series)',
        href: '/voxo-public/general/how-to-factory-reset-yealink-series',
      },
      {
        title: 'Pause and DND in OMNIA',
        href: '/voxo-public/general/pause-and-dnd-in-omnia',
      },
      {
        title: 'Custom Holiday Time of Day',
        href: '/voxo-public/general/custom-holiday-time-of-day',
      },
    ],
  },
]

export const apiNav = [
  {
    title: 'Introduction',
    links: [
      {
        title: 'Introduction',
        href: '/voxo-public/v/api-docs-1',
      },
    ],
  },
  {
    title: 'Reference',
    links: [
      {
        title: '🔑 Authentication',
        href: '/voxo-public/v/api-docs-1/reference/api-reference/authentication',
      },
      {
        title: 'Accounts',
        href: '/voxo-public/v/api-docs-1/reference/api-reference',
      },
      {
        title: 'Account Branches',
        href: '/voxo-public/v/api-docs-1/reference/api-reference',
      },
      {
        title: 'Call Blocking',
        href: '/voxo-public/v/api-docs-1/reference/api-reference',
      },
      {
        title: 'Call Groups',
        href: '/voxo-public/v/api-docs-1/reference/api-reference',
      },
      {
        title: 'Call Queues',
        href: '/voxo-public/v/api-docs-1/reference/api-reference',
      },
      {
        title: 'Call Queue Manager',
        href: '/voxo-public/v/api-docs-1/reference/api-reference',
      },
      {
        title: 'Call Recordings',
        href: '/voxo-public/v/api-docs-1/reference/api-reference',
      },
      {
        title: 'Call Reports (CDR)',
        href: '/voxo-public/v/api-docs-1/reference/api-reference',
      },
      {
        title: 'Conference Rooms',
        href: '/voxo-public/v/api-docs-1/reference/api-reference',
      },
      {
        title: 'Custom Destinations',
        href: '/voxo-public/v/api-docs-1/reference/api-reference',
      },
      {
        title: 'Devices',
        href: '/voxo-public/v/api-docs-1/reference/api-reference',
      },
      {
        title: 'E911 Locations',
        href: '/voxo-public/v/api-docs-1/reference/api-reference',
      },
      {
        title: 'Extensions',
        href: '/voxo-public/v/api-docs-1/reference/api-reference',
      },
      {
        title: 'Feature Codes',
        href: '/voxo-public/v/api-docs-1/reference/api-reference',
      },
      {
        title: 'Virtual Receptionists',
        href: '/voxo-public/v/api-docs-1/reference/api-reference',
      },
      {
        title: 'Mail To Fax Users',
        href: '/voxo-public/v/api-docs-1/reference/api-reference',
      },
      {
        title: 'Media Files',
        href: '/voxo-public/v/api-docs-1/reference/api-reference',
      },
      {
        title: 'Music On Hold',
        href: '/voxo-public/v/api-docs-1/reference/api-reference',
      },
      {
        title: 'Number Porting Orders',
        href: '/voxo-public/v/api-docs-1/reference/api-reference',
      },
      {
        title: 'Paging Groups',
        href: '/voxo-public/v/api-docs-1/reference/api-reference',
      },
      {
        title: 'Parking Lots',
        href: '/voxo-public/v/api-docs-1/reference/api-reference',
      },
      {
        title: 'Phonebooks',
        href: '/voxo-public/v/api-docs-1/reference/api-reference',
      },
      {
        title: 'Phone Numbers (DID)',
        href: '/voxo-public/v/api-docs-1/reference/api-reference',
      },
      {
        title: 'Short Numbers',
        href: '/voxo-public/v/api-docs-1/reference/api-reference',
      },
      {
        title: 'Time of Days',
        href: '/voxo-public/v/api-docs-1/reference/api-reference',
      },
      {
        title: 'Users',
        href: '/voxo-public/v/api-docs-1/reference/api-reference',
      },
      {
        title: 'Voicemails',
        href: '/voxo-public/v/api-docs-1/reference/api-reference',
      },
      {
        title: 'VOXO MEET',
        href: '/voxo-public/v/api-docs-1/reference/api-reference',
      },
      {
        title: 'Webhooks',
        href: '/voxo-public/v/api-docs-1/reference/api-reference',
      },
    ],
  },
]

export function Navigation(props) {
  const router = useRouter()

  const isApiDocs = router.pathname.includes('/v/api-docs-1')

  const selectedNavs = isApiDocs ? apiNav : navigation

  return (
    <nav {...props}>
      <ul role="list">
        <TopLevelNavItem href="/">API</TopLevelNavItem>
        <TopLevelNavItem href="#">Documentation</TopLevelNavItem>
        <TopLevelNavItem href="#">Support</TopLevelNavItem>
        {selectedNavs.map((group, groupIndex) => (
          <NavigationGroup
            key={group.title}
            group={group}
            className={groupIndex === 0 && 'md:mt-0'}
          />
        ))}
        <li className="sticky bottom-0 z-10 mt-6 min-[416px]:hidden">
          <Button href="#" variant="filled" className="w-full">
            Sign in
          </Button>
        </li>
      </ul>
    </nav>
  )
}
