import Link from "next/link";
import { UserButton } from "@stackframe/stack";
import { stackServerApp } from "@/stack/server";
import { prisma } from "@/lib/prisma";

export default async function Navbar() {
  const user = await stackServerApp.getUser();
  let existingUser;
  if (user) {
    existingUser = await prisma.user.findUnique({
      where: { id: user.id },
    });
  }

  return (
    <nav className="p-4 flex items-center justify-between bg-black text-white">
      <Link href="/">Home</Link>

      {user ? (
        <>
          <Link href="/discover">discover</Link>
          <Link href="/matches">matches</Link>
          <Link href="/likes">likes</Link>
          <div className="flex items-center justify-center gap-2">
            <UserButton />
            <Link href={`/profile/${user.id}`}>
              {existingUser.username || user.displayName}
            </Link>
          </div>
        </>
      ) : (
        <Link href="/sign-in">Sign In</Link>
      )}
    </nav>
  );
}
