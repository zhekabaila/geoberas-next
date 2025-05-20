import { members } from './member-section'
import Image from 'next/image'
import Link from 'next/link'

const ReportSection = () => {
  return (
    <section className="bg-primary rounded-lg px-5 py-10">
      <h2 className="text-center text-xl md:text-3xl font-bold">Mengalami masalah?</h2>
      <p className="text-center font-medium text-base mt-5">Hubungi kami melalui email</p>
      <ul className="grid grid-cols-1 gap-3 mt-4">
        {members.map((member) => (
          <li key={`member-${member.npm}`}>
            <Link href={`mailto:${member.email}`} className="flex items-center gap-3 bg-secondary/50 rounded-lg p-2">
              <Image
                src={member.image}
                alt={member.name}
                width={35}
                height={35}
                className="rounded-md aspect-[3/4] object-top object-cover"
              />
              <div>
                <p className="text-sm font-bold">{member.name}</p>
                <p className="text-xs mt-1">{member.email}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default ReportSection
