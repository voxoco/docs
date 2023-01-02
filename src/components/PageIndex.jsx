import React from 'react'
import { useIsInsideMobileNavigation } from './MobileNavigation'
import { useInitialValue } from './Navigation'
import { useSectionStore } from './SectionProvider'
import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/router'

const PageIndex = ({ title, section }) => {
  let [visibleSections] = useInitialValue(
    [useSectionStore((s) => s.visibleSections)],
    useIsInsideMobileNavigation()
  )
  let [router] = useInitialValue(
    [useRouter(), useSectionStore((s) => s.sections)],
    useIsInsideMobileNavigation()
  )

  return (
    <Link
      href={`${router.pathname}#${section.id}`}
      className={clsx(
        'block cursor-pointer mb-1 border-l-2 pl-6 text-sm text-gray-500 dark:text-white transition hover:text-red-500',
        section.id === visibleSections[0]
          ? 'border-l-red-500 font-medium'
          : 'border-l-transparent font-normal'
      )}
    >
      {title}
    </Link>
  )
}

export default PageIndex
