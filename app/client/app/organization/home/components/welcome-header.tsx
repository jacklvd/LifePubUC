import React from 'react'

interface WelcomeHeaderProps {
  username: string
}

const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({ username }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-4 sm:mb-0">
        Welcome back, {username}
      </h1>
    </div>
  )
}

export default WelcomeHeader
