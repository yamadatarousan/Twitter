import Link from "next/link";
import FollowButton from "./FollowButton";

interface User {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
}

interface UserListProps {
  users: User[];
}

export default function UserList({ users }: UserListProps) {
  return (
    <div className="divide-y divide-gray-200">
      {users.map((user) => (
        <div key={user.id} className="flex items-center justify-between p-4">
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
  );
} 