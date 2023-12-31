import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'

import { StoreModalProvider } from '@/providers/store-modal-provider'
import { ToastProvider } from '@/providers/toast-provider'
import { ThemeProvider } from '@/providers/theme-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Admin Dashboard'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en' className='h-full'>
      <ClerkProvider>
        <body className={`${inter.className} h-full`}>
          <ThemeProvider attribute='class' defaultTheme='dark' enableSystem>
            {children}
            <StoreModalProvider />
            <ToastProvider />
          </ThemeProvider>
        </body>
      </ClerkProvider>
    </html>
  )
}
