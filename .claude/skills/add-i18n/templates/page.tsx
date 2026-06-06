import { useTranslations } from 'next-intl'
import { Appear } from '@/components/Appear'
import { Button } from '@/components/Button'
import { TextReveal } from '@/components/TextReveal'
import { SEQUENCE_STEP } from '@/lib/motion'

export default function Home() {
  const t = useTranslations('home')
  return (
    <main className='flex flex-1 flex-col items-start gap-8 px-6 py-24'>
      <TextReveal as='h1' trigger='load' className='text-4xl font-semibold tracking-tight md:text-6xl'>
        {t('title')}
      </TextReveal>
      <TextReveal as='p' trigger='load' delay={SEQUENCE_STEP} className='text-typo-secondary max-w-xl text-lg'>
        {t('subtitle')}
      </TextReveal>
      <Appear effect='fade' trigger='load' delay={SEQUENCE_STEP * 2}>
        <Button href='/admin' text={t('openAdmin')} arrow='right' />
      </Appear>
    </main>
  )
}
