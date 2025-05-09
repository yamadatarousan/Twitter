"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import FollowButton from "./FollowButton";

type User = {
  id: string;
  name: string;
  email: string;
  followers: { followerId: string }[];
  following: { followingId: string }[];
};

export default function RecommendedUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/users/recommended");
        if (res.ok) {
          const data = await res.json();
          setUsers(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (isLoading) {
    return (
      <div className="rounded-xl bg-gray-50 p-4">
        <h2 className="mb-4 text-xl font-bold">おすすめユーザー</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
                <div className="h-3 w-32 animate-pulse rounded bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return null;
  }

  return (
    <div className="rounded-xl bg-gray-50 p-4">
      <h2 className="mb-4 text-xl font-bold">おすすめユーザー</h2>
      <div className="space-y-4">
        {users.map((user) => (
          <div key={user.id} className="flex items-center justify-between">
            <Link
              href={`/users/${user.id}`}
              className="flex items-center space-x-3"
            >
              <div className="h-10 w-10 rounded-full bg-gray-200" />
              <div>
                <p className="font-medium text-gray-900">{user.name}</p>
                <p className="text-sm text-gray-500">@{user.email}</p>
              </div>
            </Link>
            <FollowButton userId={user.id} isFollowing={false} />
          </div>
        ))}
      </div>
    </div>
  );
} 