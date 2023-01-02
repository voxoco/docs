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
              <span className="block mb-1 border-l-2 border-l-transparent cursor-pointer pl-6 text-sm text-gray-500 dark:text-white hover:text-red-500">
                Copy Link
              </span>
              {sections.length > 0
                ? sections.map((section) => (
                    <PageIndex title={section.title} section={section} />
                  ))
                : null}
            </div>
          </aside>
        </div>
      </div>
    </SectionProvider>
  )
}
