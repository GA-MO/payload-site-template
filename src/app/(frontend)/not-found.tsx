import Link from 'next/link'
import { Appear } from '@/components/Appear'
import { TextReveal } from '@/components/TextReveal'
import { SEQUENCE_STEP } from '@/lib/motion'

export default function NotFound() {
  return (
    <main className='flex flex-1 flex-col gap-8 px-6 pt-24'>
      <TextReveal as='h1' trigger='load' className='text-3xl font-semibold tracking-tight md:text-5xl'>
        404
      </TextReveal>
      <TextReveal as='p' trigger='load' delay={SEQUENCE_STEP} className='font-medium'>
        Page Not Found
      </TextReveal>
      <Appear effect='fade' trigger='load' delay={SEQUENCE_STEP * 2}>
        <Link href='/' className='hover:text-typo-muted transition-colors'>
          Back to home
        </Link>
      </Appear>
    </main>
  )
}
