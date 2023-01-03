import { motion } from 'framer-motion'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { Navigation } from '@/components/Navigation'
import { Prose } from '@/components/Prose'
import { SectionProvider } from '@/components/SectionProvider'
import PageIndex from './PageIndex'

export function Layout({ children, sections = [] }) {
  return (
    <SectionProvider sections={sections}>
      <div className="lg:ml-72 xl:ml-80">
        <motion.header
          layoutScroll
          className="fixed inset-y-0 left-0 z-40 mt-16 contents w-72 overflow-y-auto border-r border-zinc-900/10 px-6 pt-4 pb-8 dark:border-white/10 md:mt-20 lg:block xl:w-80"
        >
          <Header />
          <Navigation className="hidden lg:block" />
        </motion.header>
        <div className="relative flex px-4 pt-16 sm:px-6 md:pt-20 lg:px-8">
          <div className="flex-1 lg:pr-8">
            <main className="py-8">
              <Prose as="article">{children}</Prose>
            </main>
            <Footer />
          </div>
          <aside className="relative hidden basis-3/12 lg:block">
            <div className="sticky top-20 h-[calc(100vh-80px)] py-8">
              <span className="mb-1 flex items-center gap-x-2 cursor-pointer border-l-2 border-l-transparent pl-6 text-sm text-gray-500 hover:text-red-500 dark:text-white">
                <CopyIcon className="h-4 w-4 align-middle" />
                Copy Link
              </span>
              {sections.length > 0 ? (
                <span className="mb-1 mt-4 block border-l-2 border-l-transparent pl-6 text-sm font-semibold tracking-wider text-gray-400 dark:text-white">
                  ON THIS PAGE
                </span>
              ) : null}
              {sections.length > 0
                ? sections.map((section) => (
                    <PageIndex
                      key={section.id}
                      title={section.title}
                      section={section}
                    />
                  ))
                : null}
            </div>
          </aside>
        </div>
      </div>
    </SectionProvider>
  )
}

function CopyIcon(props) {
  return (
    <svg viewBox="0 0 16 16" fill="none" {...props}>
      <path
        d="M14.11 6.6l-.16-.09c-.042.343-.13.68-.26 1A3 3 0 0115 10a3 3 0 01-3 3H8a3 3 0 010-6h.82A3 3 0 009 6H8a4 4 0 000 8h4a4 4 0 002.11-7.4z"
        fill="currentColor"
      ></path>
      <path
        d="M1.89 9.4l.16.09c.042-.343.13-.68.26-1A3 3 0 011 6a3 3 0 013-3h4a3 3 0 110 6h-.82A3 3 0 007 10h1a4 4 0 000-8H4a4 4 0 00-2.11 7.4z"
        fill="currentColor"
      ></path>
    </svg>
  )
}
