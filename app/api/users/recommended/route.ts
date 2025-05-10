import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const currentUser = session?.user?.email
      ? await prisma.user.findUnique({
          where: { email: session.user.email },
        })
      : null;

    // フォローしていないユーザーを取得（自分自身を除く）
    const recommendedUsers = await prisma.user.findMany({
      where: {
        id: {
          not: currentUser?.id,
        },
        followers: {
          none: {
            followerId: currentUser?.id,
          },
        },
      },
      take: 3,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        followers: true,
        following: true,
      },
    });

    return NextResponse.json(recommendedUsers);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
} 