'use client'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

const HomeSection = () => {
  return (
    <div className="h-[77vh] md:h-screen  overflow-y-scroll">
      <div className="mx-4 mt-4 mb-0 md:m-20 space-y-10">
        <section className="flex md:justify-between items-center" id="hero">
          <div className="md:basis-1/2">
            <h1 className="text-xl md:text-3xl font-bold">Prediksi Harga Beras di Indonesia</h1>
            <div className="block md:hidden">
              <Image
                src="/images/logo_beras.png"
                alt="logo"
                width={350}
                height={350}
                className="w-full h-auto aspect-square"
              />
            </div>
            <p className="text-base md:text-lg mt-1">
              Analisis prediksi harga beras di indonesia pada tahun 2025 menggunakan model matematika{' '}
            </p>
            <p className="text-base md:text-lg mt-2">
              Dapatkan wawasan terbaru mengenai tren harga beras di Indonesia. Prediksi ini membantu Anda dalam mengambil
              keputusan yang lebih baik, baik untuk kebutuhan rumah tangga maupun bisnis. Data yang disajikan diolah
              menggunakan metode matematis terkini untuk hasil yang lebih akurat.
            </p>
            <Button className="mt-3">
              <a href="#grafik">Lihat Prediksi</a>
            </Button>
          </div>
          <div className="hidden md:flex justify-end items-center basis-1/2">
            <Image src="/images/logo_beras.png" alt="logo" width={350} height={350} />
          </div>
        </section>
      </div>
    </div>
  )
}

export default HomeSection
