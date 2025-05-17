'use client'
import Image from 'next/image'
import Copyright from './copyright'

const MemberSection = () => {
  const members = [
    {
      name: 'Ranji Pauzi Rohman',
      npm: '237006111',
      email: '237006111@student.unsil.ac.id',
      image: '/images/gambar_anggota_1.jpg'
    },
    {
      name: 'Zheka Baila Arkan',
      npm: '247006111152',
      email: '247006111152@student.unsil.ac.id',
      image: '/images/gambar_anggota_2.jpg'
    },
    {
      name: 'Muhammad Fauzan Gemilang',
      npm: '247006111154',
      email: '247006111154@student.unsil.ac.id',
      image: '/images/gambar_anggota_3.jpg'
    },
    {
      name: 'Muhammad Nazril Putra Rosida',
      npm: '247006111162',
      email: '247006111162@student.unsil.ac.id',
      image: '/images/gambar_anggota_4.jpg'
    },
    {
      name: 'Chintia Aurizki Putri',
      npm: '247006111175',
      email: '247006111175@student.unsil.ac.id',
      image: '/images/gambar_anggota_5.jpg'
    }
  ]

  return (
    <div className="relative h-full md:h-screen overflow-y-scroll">
      <div className="mx-4 my-6 md:m-20 space-y-10">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">Anggota Kelompok</h1>
        </div>

        {/* Baris atas: 3 orang */}
        <div className="flex flex-wrap justify-center gap-8 mb-8">
          {members.slice(0, 3).map((member) => (
            <div
              key={member.name}
              className="bg-[#d6d0c6] p-5 rounded-2xl shadow-md hover:shadow-xl transition-transform transform hover:scale-105 w-[280px] text-center border border-gray-300">
              <div className="flex justify-center mb-3">
                <Image src={member.image} alt={member.name} width={80} height={80} className="rounded-lg" />
              </div>
              <h2 className="text-lg font-semibold text-gray-800">{member.name}</h2>
              <p className="text-sm text-blue-600 font-medium">{member.npm}</p>
              <p className="text-xs text-blue-500 mt-2">{member.email}</p>
            </div>
          ))}
        </div>

        {/* Baris bawah: 2 orang, diratakan tengah */}
        <div className="flex flex-wrap justify-center gap-8">
          {members.slice(3, 5).map((member) => (
            <div
              key={member.name}
              className="bg-[#d6d0c6] p-5 rounded-2xl shadow-md hover:shadow-xl transition-transform transform hover:scale-105 w-[280px] text-center border border-gray-300">
              <div className="flex justify-center mb-3">
                <Image src={member.image} alt={member.name} width={80} height={80} className="rounded-lg" />
              </div>
              <h2 className="text-lg font-semibold text-gray-800">{member.name}</h2>
              <p className="text-sm text-blue-600 font-medium">{member.npm}</p>
              <p className="text-xs text-blue-500 mt-2">{member.email}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="relative lg:absolute bottom-0 w-full">
        <Copyright />
      </div>
    </div>
  )
}

export default MemberSection
