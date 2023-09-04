import { Footer } from '@/components/footer'
import './globals.css'
import type { Metadata } from 'next'
import { Urbanist } from 'next/font/google'
import { Navbar } from '@/components/navbar'
import { ModalProvider } from '@/providers/modal-provider'
import { ToastProvider } from '@/providers/toast-provider'

const urbanistFont = Urbanist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Store',
  description: 'Store'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <body className={urbanistFont.className}>
        <Navbar />
        {children}
        <Footer />
        <ModalProvider />
        <ToastProvider />
      </body>
    </html>
  )
}
