import { RiNextjsFill, RiTailwindCssFill, RiNodejsFill } from 'react-icons/ri'
import { BiLogoTypescript } from 'react-icons/bi'
import { ChartColumnIncreasing, Framer, SquareLibrary } from 'lucide-react'

export const technologies = [
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
  },
  {
    name: 'Motion',
    icon: <Framer size={50} />,
    link: 'https://motion.dev/'
  },
  {
    name: 'Zustand',
    icon: <SquareLibrary size={50} />,
    link: 'https://zustand.docs.pmnd.rs/getting-started/introduction'
  },
  {
    name: 'Chart.js',
    icon: <ChartColumnIncreasing size={50} />,
    link: 'https://www.chartjs.org/'
  }
]
