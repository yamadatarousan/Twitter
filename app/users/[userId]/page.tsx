import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";
import FollowButton from "@/components/FollowButton";

export default async function UserProfilePage({
  params,
}: {
  params: { userId: string };
}) {
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
    where: { id: params.userId },
    include: {
      followers: true,
      following: true,
      tweets: {
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          likes: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!user) {
    redirect("/");
  }

  const isFollowing = user.followers.some(
    (follow) => follow.followerId === currentUser.id
  );

  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="mb-4 flex items-center space-x-4">
        <Link href="/" className="text-gray-500 hover:text-gray-700">
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
          <p className="text-sm text-gray-500">@{user.email}</p>
        </div>
      </div>

      <div className="mb-4 flex items-center space-x-4">
        <Link
          href={`/users/${user.id}/following`}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          <span className="font-bold text-gray-900">{user.following.length}</span>{" "}
          フォロー中
        </Link>
        <Link
          href={`/users/${user.id}/followers`}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          <span className="font-bold text-gray-900">{user.followers.length}</span>{" "}
          フォロワー
        </Link>
      </div>

      {currentUser.id !== user.id && (
        <div className="mb-4">
          <FollowButton userId={user.id} isFollowing={isFollowing} />
        </div>
      )}

      <div className="divide-y divide-gray-200">
        {user.tweets.map((tweet) => (
          <div key={tweet.id} className="p-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-gray-200" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center space-x-1">
                  <p className="text-sm font-medium text-gray-900">
                    {tweet.author.name}
                  </p>
                  <span className="text-sm text-gray-500">·</span>
                  <p className="text-sm text-gray-500">
                    {new Date(tweet.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <p className="mt-1 text-sm text-gray-900">{tweet.content}</p>
                <div className="mt-2 flex items-center space-x-4">
                  <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-500">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    <span className="text-sm">0</span>
                  </button>
                  <button className="flex items-center space-x-1 text-gray-500 hover:text-green-500">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    <span className="text-sm">0</span>
                  </button>
                  <button className="flex items-center space-x-1 text-gray-500 hover:text-red-500">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    <span className="text-sm">{tweet.likes.length}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 