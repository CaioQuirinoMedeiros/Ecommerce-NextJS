import { UserButton } from '@clerk/nextjs'

export default function RootPage() {
  return (
    <main className='flex items-center justify-center h-full gap-4 flex-col'>
      This is a protected route
      <UserButton afterSignOutUrl='/' />
    </main>
  )
}
