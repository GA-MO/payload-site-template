import { Appear } from '@/components/Appear'
import { Button } from '@/components/Button'
import { TextReveal } from '@/components/TextReveal'
import { SEQUENCE_STEP } from '@/lib/motion'

export default async function Home() {
  return (
    <main className='flex flex-1 flex-col items-start gap-8 px-6 py-24'>
      <TextReveal as='h1' trigger='load' className='text-4xl font-semibold tracking-tight md:text-6xl'>
        Payload Site Template
      </TextReveal>
      <TextReveal as='p' trigger='load' delay={SEQUENCE_STEP} className='text-typo-secondary max-w-xl text-lg'>
        A Figma + Payload + Next.js starter. Replace this page with your first feature.
      </TextReveal>
      <Appear effect='fade' trigger='load' delay={SEQUENCE_STEP * 2}>
        <Button href='/admin' text='Open admin' arrow='right' />
      </Appear>
    </main>
  )
}
