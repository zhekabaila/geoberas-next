import Link from 'next/link'
import { technologies } from '../_constants/technologies'

const TechnologySection = () => {
  return (
    <div className="h-full md:h-screen overflow-y-scroll">
      <div className="mx-4 my-6 md:m-20 space-y-10">
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
      </div>
    </div>
  )
}

export default TechnologySection
