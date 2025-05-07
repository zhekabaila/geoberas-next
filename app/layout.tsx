import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import { ThemeProvider } from './_components/theme-provider'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/sonner'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900'
})
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900'
})

export const metadata: Metadata = {
  title: 'Geoberas | Prediksi Harga Beras di Indonesia',
  description:
    'Analisis prediksi harga beras di indonesia pada tahun 2025 menggunakan model matematika. Dapatkan wawasan terbaru mengenai tren harga beras di Indonesia. Prediksi ini membantu Anda dalam mengambil keputusan yang lebih baik, baik untuk kebutuhan rumah tangga maupun bisnis. Data yang disajikan diolah menggunakan metode matematis terkini untuk hasil yang lebih akurat.'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <TooltipProvider>{children}</TooltipProvider>
          <Toaster richColors />
        </ThemeProvider>
      </body>
    </html>
  )
}
