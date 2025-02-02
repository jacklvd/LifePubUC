import React from 'react'
import Navbar from '@/components/navbar'

const LayoutPage = ({children}: {children: React.ReactNode}) => {
  return (
    <div className='flex-col w-full min-h-full'>
        <Navbar/>
        <main>{children}</main>

    </div>
  )
}

export default LayoutPage