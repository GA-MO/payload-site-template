import { gsap } from 'gsap'
import { CustomEase } from 'gsap/CustomEase'

// One shared motion language for every reveal on the site. Keeping ease,
// duration, distance and stagger identical everywhere is what makes the page
// read as a single continuous cascade instead of each element popping on its
// own clock.
if (typeof window !== 'undefined') {
  gsap.registerPlugin(CustomEase)
  // Luxury settle curve (expo-out family): quick lead, long soft landing.
  CustomEase.create('premium', '0.16, 1, 0.3, 1')
}

export const MOTION = {
  ease: 'premium',
  // Slow + small reads as expensive; fast + far reads as cheap.
  duration: 1.1,
  distance: 28,
  // Short stagger against a long duration → items overlap into one wave.
  stagger: 0.09,
  // Focus-pull: a touch of defocus on entry reads as cinematic. Cheap on text,
  // costly on many images — keep it off the card grids.
  blur: 6,
  start: 'top 85%'
} as const

// Gap between stages of an ordered hero reveal (title → body → items → …).
// Each stage starts one step after the previous — a beat, not a full stop — so
// the cluster plays as one connected run. Stage N delay = SEQUENCE_STEP * N.
export const SEQUENCE_STEP = 0.16

