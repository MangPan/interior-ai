import { db } from '../../../config/db';
import { Users } from '../../../config/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const { user } = await req.json()

  const userInfo = await db
    .select()
    .from(Users)
    .where(eq(Users.email, user?.primaryEmailAddress?.emailAddress))

  if (userInfo?.length === 0) {
    const saveResult = await db
      .insert(Users)
      .values({
        name: user?.fullName,
        email: user?.primaryEmailAddress?.emailAddress,
        imageUrl: user?.imageUrl,
      })
      .returning()

    return NextResponse.json(saveResult[0])
  }

  return NextResponse.json(userInfo[0])
}