export const faqData = [
  {
    id: 'item-1',
    question: 'Dari mana data harga beras diperoleh?',
    answer:
      'Data harga beras yang digunakan oleh Geoberas berasal dari sumber resmi seperti Badan Pusat Statistik (BPS) dan Kementerian Pertanian. Data yang diperoleh adalah data dari bulan januari hingga awal april. Data ini kemudian dianalisis untuk membuat prediksi harga di masa mendatang.'
  },
  {
    id: 'item-2',
    question: 'Apa itu geoberas?',
    answer:
      'Geoberas adalah aplikasi web yang memanfaatkan rumus barisan geometri untuk memberikan prediksi harga beras di wilayah indonesia. Dengan menggabungkan data historis dan model prediktif(perhitungan barisan geometri), Geoberas membantu pengguna memahami tren harga beras di daerah indonesia.'
  },
  {
    id: 'item-3',
    question: 'Apakah Geoberas dapat diakses melalui perangkat mobile?',
    answer: 'Ya, Geoberas dirancang responsif dan dapat diakses melalui berbagai perangkat, termasuk smartphone dan tablet.'
  },
  {
    id: 'item-4',
    question: 'Bisa memprediksi beras apa saja di geoberas?',
    answer:
      'geoberas bisa memprediksi harga beras medium dan harga beras premium sesuai data yang didapatkan oleh tim geoberas. Data beras medium itu dari 2025-01-17 sampe 2025-04-17 sedangkan data beras premium dari 2025-01-15 sampe 2025-04-15'
  },
  {
    id: 'item-5',
    question: 'Bagaimana cara kerja Geoberas?',
    answer: `Geoberas meminta pengguna untuk memasukkan:
                <br />
                <br />
                • Harga awal (a)
                <br />
                • Rasio perubahan (r)
                <br />
                • Jumlah bulan (n)
                <br />
                <br />
                Aplikasi kemudian menghitung harga beras ke-n menggunakan rumus barisan geometri:
                <br />
                Un = a × r^(n-1)`
  },
  {
    id: 'item-6',
    question: 'Apakah prediksi ini akurat?',
    answer:
      'Prediksi ini bersifat teoretis dan mengasumsikan pertumbuhan harga konstan sesuai rasio yang ditentukan. Meskipun tidak mencerminkan data riil pasar, ini berguna untuk simulasi dan pembelajaran matematika.'
  },
  {
    id: 'item-7',
    question: 'Mengapa digunakan barisan geometri untuk prediksi harga beras?',
    answer:
      'Barisan geometri cocok digunakan karena mencerminkan kenaikan harga yang bersifat eksponensial, misalnya akibat inflasi atau tren pasar yang terus naik atau bahkan turun.'
  }
]
