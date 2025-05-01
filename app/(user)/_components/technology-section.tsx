import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { RiNextjsFill, RiTailwindCssFill, RiNodejsFill } from 'react-icons/ri'
import { BiLogoTypescript } from 'react-icons/bi'
import Link from 'next/link'

const TechnologySection = () => {
  const technologies = [
    {
      name: 'Next Js',
      icon: <RiNextjsFill size={50} />,
      link: 'https://nextjs.org/'
    },
    {
      name: 'TypeScript',
      icon: <BiLogoTypescript size={50} />,
      link: 'https://www.typescriptlang.org/'
    },
    {
      name: 'Tailwind CSS',
      icon: <RiTailwindCssFill size={50} />,
      link: 'https://tailwindcss.com'
    },
    {
      name: 'Node.js',
      icon: <RiNodejsFill size={50} />,
      link: 'https://nodejs.org/en'
    }
  ]
  return (
    <ScrollArea className="h-[77vh] md:h-screen overflow-y-scroll">
      <div className="mx-4 mt-4 mb-0 md:m-20 space-y-10">
        <h1 className="text-xl md:text-3xl font-bold">Teknologi yang digunakan</h1>
        <div className="flex flex-col items-center md:items-start md:flex-row flex-wrap gap-10">
          {technologies.map((technology) => (
            <div
              className="flex flex-col items-center gap-2 bg-primary p-4 rounded-lg drop-shadow-md w-[200px]"
              key={technology.name}>
              {technology.icon}
              <Link href={technology.link} target="_blank">
                <h2 className="text-lg font-bold">{technology.name}</h2>
              </Link>
            </div>
          ))}
        </div>
        <ScrollBar orientation="vertical" />
      </div>
    </ScrollArea>
  )
}

export default TechnologySection
