'use client'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { faqData } from '../_constants/faq'
import Copyright from './copyright'
import { z } from 'zod'
import ReportSection from './report-section'

export const reportSchema = z.object({
  name: z.string().min(3, 'Nama harus lebih dari 3 karakter'),
  email: z.string().email('Email tidak valid'),
  message: z.string().min(3, 'Pesan harus lebih dari 3 karakter'),
  image: z.any()
})

const HomeSection = () => {
  const searchParams = useSearchParams()
  const navigate = useRouter()

  return (
    <div className="h-full md:h-screen overflow-y-scroll">
      <div className="mx-4 my-6 md:m-20 space-y-20">
        <section className="flex md:justify-between items-center" id="hero">
          <div className="md:basis-1/2">
            <h1 className="text-lg md:text-3xl font-bold mb-5">Prediksi Harga Beras di Indonesia</h1>
            <div className="block md:hidden">
              <Image
                src="/images/logo_beras.png"
                alt="logo"
                width={350}
                height={350}
                className="w-full h-auto aspect-square"
              />
            </div>
            <p className="text-sm lg:text-base mt-1">
              Analisis prediksi harga beras di indonesia pada tahun 2025 menggunakan model matematika{' '}
            </p>
            <p className="text-sm lg:text-base mt-2">
              Dapatkan wawasan terbaru mengenai tren harga beras di Indonesia. Prediksi ini membantu Anda dalam mengambil
              keputusan yang lebih baik, baik untuk kebutuhan rumah tangga maupun bisnis. Data yang disajikan diolah
              menggunakan metode matematis terkini untuk hasil yang lebih akurat.
            </p>
            <Button
              className="mt-7"
              onClick={() => {
                const params = new URLSearchParams(searchParams.toString())

                params.set('active', '1')

                navigate.replace(`?${params.toString()}`, { scroll: false })
              }}>
              Lihat Prediksi
            </Button>
          </div>
          <div className="hidden md:flex justify-end items-center basis-1/2">
            <Image src="/images/logo_beras.png" alt="logo" width={350} height={350} />
          </div>
        </section>
        <section className="bg-background rounded-md">
          <h2 className="text-lg md:text-3xl font-bold">Metodologi Perhitungan Prediksi</h2>
          <p className="text-sm lg:text-base mt-2">
            Prediksi harga beras di Indonesia pada aplikasi ini menggunakan metode{' '}
            <span className="font-semibold">barisan geometri</span> dengan langkah-langkah sebagai berikut:
          </p>
          <div className="mt-4 space-y-4">
            <div>
              <h3 className="text-base lg:text-lg font-semibold">1. Pengambilan Data Harga Harian</h3>
              <p className="text-sm lg:text-base mt-1">Ambil data harga beras harian dari data historis yang tersedia.</p>
            </div>
            <div>
              <h3 className="text-base lg:text-lg font-semibold">2. Hitung Rasio Pertumbuhan Harian</h3>
              <p className="text-sm lg:text-base mt-1">Hitung rasio pertumbuhan harian dengan rumus:</p>
              <div className="bg-secondary/50 p-4 rounded-md mt-2">
                <p className="text-xs lg:text-base font-mono">Rasio-i = Harga hari ke-i / Harga hari ke (i-1)</p>
              </div>
              <p className="text-sm lg:text-base mt-2">
                Lakukan perhitungan ini untuk setiap hari dalam data (kecuali hari pertama).
              </p>
            </div>
            <div>
              <h3 className="text-base lg:text-lg font-semibold">3. Hitung Rata-rata Rasio Pertumbuhan</h3>
              <p className="text-sm lg:text-base mt-1">
                Setelah mendapatkan seluruh rasio harian, hitung rata-rata dari semua rasio tersebut dengan rumus:
              </p>
              <div className="bg-secondary/50 p-4 rounded-md mt-2">
                <p className="text-xs lg:text-base font-mono">r = (r₁ + r₂ + ... + rₙ) / n</p>
              </div>
              <p className="text-sm lg:text-base mt-2">
                Di mana r₁, r₂, ..., rₙ adalah rasio pertumbuhan harian dan n adalah jumlah rasio yang dihitung.
              </p>
            </div>
            <div>
              <h3 className="text-base lg:text-lg font-semibold">4. Prediksi Harga Hari Berikutnya</h3>
              <p className="text-sm lg:text-base mt-1">
                Prediksi harga untuk hari ke-mendatang dihitung dengan rumus barisan geometri:
              </p>
              <div className="bg-secondary/50 p-4 rounded-md mt-2">
                <p className="text-xs lg:text-base font-mono">Harga Prediksi ke-k = Harga Terakhir × r^k</p>
              </div>
              <p className="text-sm lg:text-base mt-2">
                Di mana:
                <br />
                - Harga Terakhir adalah harga pada hari terakhir data historis
                <br />
                - r adalah rata-rata rasio pertumbuhan harian
                <br />- k adalah jumlah hari setelah data terakhir yang ingin diprediksi
              </p>
            </div>
            <div>
              <h3 className="text-base lg:text-lg font-semibold">5. Karakteristik Model</h3>
              <ul className="list-disc list-inside text-sm lg:text-base mt-1 space-y-2">
                <li>Model ini mengasumsikan pertumbuhan harga mengikuti pola geometri (rasio tetap setiap hari).</li>
                <li>Prediksi sangat bergantung pada pola pertumbuhan historis harga beras.</li>
                <li>Hasil prediksi dibulatkan hingga 3 angka desimal untuk akurasi yang lebih baik.</li>
                <li>Model cocok untuk tren harga yang cenderung naik/turun secara proporsional.</li>
              </ul>
            </div>
          </div>
        </section>
        <section>
          <h2 className="text-xl md:text-3xl font-bold">FAQ</h2>
          <Accordion type="single" collapsible>
            {faqData.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id} className="border-b-black">
                <AccordionTrigger className="text-sm lg:text-lg font-semibold">{faq.question}</AccordionTrigger>
                <AccordionContent>
                  <div dangerouslySetInnerHTML={{ __html: faq.answer }} className="text-xs lg:text-base" />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
        <ReportSection />
      </div>
      <Copyright />
    </div>
  )
}

export default HomeSection
