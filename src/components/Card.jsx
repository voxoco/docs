import clsx from 'clsx'
import React from 'react'

export function Card({ className }) {
  return (
    <div
      className={clsx(
        'dark:hover:text-text-red-500 flex w-full transform cursor-pointer items-center gap-x-2 rounded-[4px] border p-4 text-2xl font-semibold transition hover:-translate-y-[2px] hover:text-red-500 dark:text-white dark:hover:text-red-500 bg-white hover:shadow-md',
        className
      )}
    >
      <div className="item-center flex h-10 p-1 w-10 justify-center rounded-md bg-gray-50 border-[0.5px] border-gray-300">⚙️</div>
      API Docs
    </div>
  )
}
