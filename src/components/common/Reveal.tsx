import { type ReactNode } from 'react'
import { motion, type Variants } from 'framer-motion'

const variants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
}

interface RevealProps {
  children: ReactNode
  delay?: number
  className?: string
  /** Render as a list-item-friendly wrapper without layout shift. */
  as?: 'div' | 'li' | 'section'
}

/** Fade-and-rise on scroll into view. Respects reduced-motion via Framer config. */
export function Reveal({ children, delay = 0, className, as = 'div' }: RevealProps) {
  const MotionTag = motion[as]
  return (
    <MotionTag
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </MotionTag>
  )
}
