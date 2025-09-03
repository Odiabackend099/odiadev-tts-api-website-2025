import { PremiumHero } from '../components/ui/PremiumHero'
import { TrustBar } from '../components/ui/TrustBar'
import { ValueGrid } from '../components/ui/ValueGrid'
import { WhatWeDoSplit } from '../components/ui/WhatWeDoSplit'
import { PressCards } from '../components/ui/PressCards'
import { CtaBand } from '../components/ui/CtaBand'

export const Home = () => {
  return (
    <div className="bg-navy">
      <PremiumHero />
      <TrustBar />
      <ValueGrid />
      <WhatWeDoSplit />
      <PressCards />
      <CtaBand />
    </div>
  )
}
