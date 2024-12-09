import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { ReactNode } from 'react'
import { Toaster } from '@/components/ui/toaster'
import NextTopLoader from 'nextjs-toploader'

const poppins = Poppins({
  weight: ['300', '500', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://www.tulaganov-portfolio.uz'),
  title: 'Tulaganov | Portfolio',
  description: 'This is a portfolio website created by Otabek Tulaganov.',
  icons: { icon: '/favicon.png' },
  authors: [{ name: 'Otabek Tulaganov', url: 'https://www.tulaganov-portfolio.uz' }],
  openGraph: {
    title: 'Tulaganov | Portfolio',
    description: 'This is a portfolio website created by Otabek Tulaganov.',
    type: 'website',
    url: 'https://www.tulaganov-portfolio.uz',
    locale: 'en_US',
    images: 'https://i.postimg.cc/XYkbr4pq/Screenshot-2024-12-09-174158.png',
    countryName: 'Uzbekistan',
    siteName: 'Tulagnov',
    emails: 'tulaganovok04@gmail.com',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang='en'>
      <body className={`${poppins.variable} font-poppins`}>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <NextTopLoader
            color='#3182CE'
            initialPosition={0.5}
            crawlSpeed={200}
            height={2}
            crawl={true}
            showSpinner={false}
            easing='ease'
            speed={200}
            shadow='0 0 10px #3182CE,0 0 5px #3182CE'
          />
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
