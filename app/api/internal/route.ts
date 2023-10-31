import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    // You can perform any other operations you need here that don't involve OpenAI, Pinecone, receiving, or returning values.
  } catch (error) {
    console.log('[ERROR]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
