import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import Image from 'next/image'

const MemberSection = () => {
  const members = [
    {
      name: 'Ranji Pauzi Rohman',
      npm: '237006111',
      role: 'Frontend Developer',
      image: '/images/logo_beras.png'
    },
    {
      name: 'Zheka Baila Arkan',
      npm: '247006111152',
      role: 'Frontend Developer',
      image: '/images/logo_beras.png'
    },
    {
      name: 'Muhammad Fauzan Gemilang',
      npm: '247006111154',
      role: 'Frontend Developer',
      image: '/images/logo_beras.png'
    },
    {
      name: 'Muhammad Nazril Putra Rosida',
      npm: '247006111162',
      role: 'Frontend Developer',
      image: '/images/logo_beras.png'
    },
    {
      name: 'Chintia Aurizki Putri',
      npm: '247006111175',
      role: 'Frontend Developer',
      image: '/images/logo_beras.png'
    }
  ]
  return (
    <ScrollArea className="h-[77vh] md:h-screen overflow-y-scroll">
      <div className="mx-4 mt-4 mb-0 md:m-20 space-y-10">
        <h1 className="text-xl md:text-3xl font-bold">Anggota Kelompok</h1>
        <div className="flex flex-wrap justify-center gap-10">
          {members.map((member) => (
            <div className="bg-primary p-4 rounded-lg drop-shadow-md w-[300px]" key={member.name}>
              <Image src={member.image} alt="Member 1" width={100} height={100} />
              <h2 className="text-lg font-bold">{member.name}</h2>
              <p className="text-sm text-gray-500">{member.npm}</p>
              <p className="text-sm text-gray-500">{member.role}</p>
            </div>
          ))}
        </div>
        <ScrollBar orientation="vertical" />
      </div>
    </ScrollArea>
  )
}

export default MemberSection
