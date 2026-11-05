import type { Metadata, Viewport } from 'next'
import 'vazirmatn/Vazirmatn-font-face.css'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from '@/components/theme-provider'
import { PwaRegister } from '@/components/pwa-register'

export const metadata: Metadata = {
  title: 'کارلیست — کارهای روزانه',
  description: 'اپ ساده و موبایلی مدیریت کارهای روزانه با سرور و دیتابیس واقعی',
  applicationName: 'کارلیست',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'کارلیست',
  },
  icons: {
    icon: '/icon-192.png',
    apple: '/apple-touch-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#0f766e',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body className="antialiased bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <PwaRegister />
          <Toaster position="top-center" richColors />
        </ThemeProvider>
      </body>
    </html>
  )
}
