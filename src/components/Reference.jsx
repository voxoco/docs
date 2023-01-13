import { Button } from '@/components/Button'
import { Heading } from '@/components/Heading'

const reference = [
  {
    href: '/voxo-public/v/api-docs-1/reference/api-reference/authentication',
    name: 'Authentication',
    description: 'Learn how to authenticate your API requests.',
  },
  {
    href: '/voxo-public/v/api-docs-1/reference/api-reference/accounts',
    name: 'Account',
    description: 'Understand how to work with account responses.',
  },
  {
    href: '/voxo-public/v/api-docs-1/reference/api-reference/branches',
    name: 'Account Branches',
    description: 'Understand how to work with account branches responses.',
  },
  {
    href: '/voxo-public/v/api-docs-1/reference/api-reference/webhooks',
    name: 'Webhooks',
    description:
      'Learn how to programmatically configure webhooks for your app.',
  },
]

export function Reference() {
  return (
    <div className="my-16 xl:max-w-none">
      <Heading level={2} id="reference">
        Reference
      </Heading>
      <div className="not-prose mt-4 grid grid-cols-1 gap-8 border-t border-zinc-900/5 pt-10 dark:border-white/5 sm:grid-cols-2 xl:grid-cols-4">
        {reference.map((guide) => (
          <div key={guide.href}>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
              {guide.name}
            </h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              {guide.description}
            </p>
            <p className="mt-4">
              <Button href={guide.href} variant="text" arrow="right">
                Read more
              </Button>
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
