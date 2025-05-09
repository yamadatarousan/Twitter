import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import FollowButton from "@/components/FollowButton";

export default async function FollowersPage({
  params,
}: {
  params: { userId: string };
}) {
  const userId = params.userId;
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    redirect("/login");
  }

  const currentUser = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!currentUser) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      followers: {
        include: {
          follower: {
            include: {
              followers: true,
            },
          },
        },
      },
    },
  });

  if (!user) {
    redirect("/");
  }

  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="mb-4 flex items-center space-x-4">
        <Link href={`/users/${userId}`} className="text-gray-500 hover:text-gray-700">
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </Link>
        <div>
          <h1 className="text-xl font-bold">{user.name}</h1>
          <p className="text-sm text-gray-500">フォロワー</p>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {user.followers.map((follow) => (
          <div key={follow.follower.id} className="flex items-center justify-between p-4">
            <Link
              href={`/users/${follow.follower.id}`}
              className="flex items-center space-x-3"
            >
              <div className="h-10 w-10 rounded-full bg-gray-200" />
              <div>
                <p className="font-medium text-gray-900">{follow.follower.name}</p>
                <p className="text-sm text-gray-500">@{follow.follower.email}</p>
              </div>
            </Link>
            {currentUser.id !== follow.follower.id && (
              <FollowButton
                userId={follow.follower.id}
                isFollowing={follow.follower.followers.some(
                  (f) => f.followerId === currentUser.id
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 