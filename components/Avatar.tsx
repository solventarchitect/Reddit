import React from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import Image from 'next/image'

type Props = {
    seed?: string
    large?: boolean
}

function Avatar({seed, large}: Props) {
    const { data: session, status } = useSession()
    const loading = status === 'loading'

  return (
    <div className={`relative overflow-auto h-10 w-10 rounded-full border-gray-300 bg-white ${large && 'h-20 w-20'}`}>
        <Image 
        layout='fill' 
        src={`https://avatars.dicebear.com/api/open-peeps/${session?.user?.name || 'placeholder'}.svg`} />
    </div>
  )
}

export default Avatar