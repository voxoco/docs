import { NextResponse } from 'next/server'

export function middleware(request) {
  const url = request.nextUrl.clone()
  if (url.pathname === '/') {
    url.pathname = '/voxo-public/release-notes/whats-new'
    return NextResponse.redirect(url)
  }
}
