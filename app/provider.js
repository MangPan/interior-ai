'use client'

import React, { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import axios from 'axios'
import { UserDetailContext } from './_context/UserDetailContext'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'

function Provider({ children }) {
  const { user } = useUser()
  const [userDetail, setUserDetail] = useState(null)

  useEffect(() => {
    if (user) {
      verifyUser()
    }
  }, [user])

  const verifyUser = async () => {
    const dataResult = await axios.post('/api/verify-user', {
      user: user,
    })

    console.log(dataResult.data)
    setUserDetail(dataResult.data)
  }

  return (
    <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
      <PayPalScriptProvider options={{clientId:process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}}>
      <div>
        {children}
      </div>
      </PayPalScriptProvider>
    </UserDetailContext.Provider>
  )
}

export default Provider