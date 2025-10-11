import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Salam Site Management',
  description: 'Manage and track site installations',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster 
          position="top-right"
          toastOptions={{
            success: {
              duration: 3000,
              style: {
                background: '#036B34',
                color: '#fff',
              },
            },
            error: {
              duration: 4000,
              style: {
                background: '#e74c3c',
                color: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  )
}