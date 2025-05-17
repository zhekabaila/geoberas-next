import Link from 'next/link'
import { technologies } from '../_constants/technologies'
import Copyright from './copyright'

const TechnologySection = () => {
  return (
    <div className="relative h-full md:h-screen overflow-y-scroll">
      <div className="mx-4 my-6 md:m-20 space-y-10">
        <h1 className="text-xl md:text-3xl font-bold">Teknologi yang digunakan</h1>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-5 lg:gap-10">
          {technologies.map((technology) => (
            <div
              className="flex flex-col items-center gap-2 bg-primary p-4 rounded-lg drop-shadow-md w-full"
              key={technology.name}>
              {technology.icon}
              <Link href={technology.link} target="_blank">
                <h2 className="text-lg font-bold">{technology.name}</h2>
              </Link>
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

export default TechnologySection
