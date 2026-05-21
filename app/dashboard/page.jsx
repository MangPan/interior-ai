'use client'

import React, { useContext } from 'react'
import { UserDetailContext } from '../_context/UserDetailContext'
import Listing from './_components/Listing'

function Dashboard() {
  const { userDetail } = useContext(UserDetailContext)

  return (
    <div>
      <Listing></Listing>
    </div>
  )
}

export default Dashboard