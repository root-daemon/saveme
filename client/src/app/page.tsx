import React from 'react'
import BlurText from '../components/animated/BlurText'
import CircularText from '../components/animated/Circular'
import { FaEthereum } from 'react-icons/fa'

export default function Home() {
  return (
    <main className='bg-background w-screen min-h-screen px-32 py-32'>
      <div className='flex items-center w-full justify-between'>

        <div>
          <BlurText
            text="Save yourself from"
            delay={0.01}

            animateBy="letters"
            direction="top"
            className="text-7xl font-semibold mb-1 text-white"
          />
          <BlurText
            text="rug-pulled"
            delay={0.05}

            animateBy="letters"
            direction="top"
            className="text-7xl font-semibold mb-1 text-foreground"
          />
        </div>
        <div className='relative'>
          <CircularText
            text="SELF*DESTRUCTIVE*CONTRACTS*"
            onHover="goBonkers"
            spinDuration={20}
            className="font-normal"
          />
          <FaEthereum className='text-white opacity-30 absolute text-7xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2' />
        </div>
      </div>
    </main>
  )
}
