import { HowItWorksCard } from '@/components/landing/HowItWorksCard'
import { HeroCard } from '@/components/landing/HeroCard'
import { MemorialCard } from '@/components/landing/MemorialCard'
import { OrnamentDivider } from '@/components/theme/ornaments'

export default function LandingPage() {
  return (
    <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-8 lg:grid-cols-2 lg:items-stretch lg:py-12">
      <div className="flex flex-col lg:gap-y-4">
        <HeroCard className="" />
        <OrnamentDivider className="hidden lg:flex" />
        <MemorialCard className="flex-1" />
      </div>
      <HowItWorksCard className="lg:flex lg:flex-col" />
    </div>
  )
}