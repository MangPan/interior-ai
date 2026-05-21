"use client"

import React, { useContext, useState } from "react"
import { PayPalButtons } from "@paypal/react-paypal-js"
import { useRouter } from "next/navigation"
import { db } from "../../../config/db"
import { Users } from "../../../config/schema"
import { UserDetailContext } from "../../_context/UserDetailContext"
import { eq } from "drizzle-orm"

function BuyCredits() {
  const [selectedOption, setSelectedOption] = useState(null)

  const { userDetail, setUserDetail } = useContext(UserDetailContext)

  const router = useRouter()

  const creditsOption = [
    {
      credits: 5,
      amount: 0.99,
    },
    {
      credits: 10,
      amount: 1.99,
    },
    {
      credits: 25,
      amount: 3.99,
    },
    {
      credits: 50,
      amount: 6.99,
    },
    {
      credits: 100,
      amount: 9.99,
    },
  ]

  const onPaymentSuccess = async () => {
    console.log("Payment Success...")

    if (!userDetail || !selectedOption) {
      console.error("userDetail 또는 selectedOption이 없습니다.")
      return
    }

    const result = await db
      .update(Users)
      .set({
        credits: userDetail.credits + selectedOption.credits,
      })
      .where(eq(Users.id, userDetail.id))
      .returning({ id: Users.id })

    if (result) {
      setUserDetail((prev) => ({
        ...prev,
        credits: userDetail.credits + selectedOption.credits,
      }))

      router.push("/dashboard")
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-6">
        Buy More Credits
      </h2>

      <div className="flex flex-row gap-4 justify-center">
        {creditsOption.map((item, index) => (
          <div
            key={index}
            className={`card bg-base-100 w-40 shadow-xl cursor-pointer ${
              selectedOption?.credits === item.credits
                ? "border-2 border-primary"
                : ""
            }`}
          >
            <div className="card-body items-center text-center">
              <h2 className="card-title">{item.credits} Credits</h2>
              <p>for ${item.amount}</p>

              <button
                className="btn btn-primary"
                onClick={() => setSelectedOption(item)}
              >
                Select
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-3xl mx-auto mt-10">
        {selectedOption?.amount && (
          <PayPalButtons
            style={{
              layout: "horizontal",
            }}
            createOrder={(data, actions) => {
              return actions.order.create({
                purchase_units: [
                  {
                    amount: {
                      value: selectedOption.amount.toFixed(2),
                      currency_code: "USD",
                    },
                  },
                ],
              })
            }}
            onApprove={() => onPaymentSuccess()}
            onCancel={() => console.log("Payment Cancelled")}
          />
        )}
      </div>
    </div>
  )
}

export default BuyCredits