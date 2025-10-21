import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";
export default async function page() {
  const user = await getCurrentUser();
  const existingUser = await prisma.user.findUnique({
    where: { id: user.id },
  });
  const allUserMatches = await prisma.match.findMany({
    where: {
      OR: [{ user1Id: existingUser.id }, { user2Id: existingUser.id }],
    },
    include: {
      user1: true,
      user2: true,
    },
  });
  console.log(allUserMatches);
  return (
    <div className="flex flex-col justify-center items-center">
      Your Matches {allUserMatches.length}
      {allUserMatches.length > 0 &&
        allUserMatches.map((item) => {
          const matchId = item.user1Id === user.id ? 2 : 1;
          const key = `user${matchId}`;
          return (
            <Link
              key={item.id}
              className="border-black border-1"
              href={`/chat/${item[key].id}`}
            >
              name:{item[key].username}
              <br />
              age:{item[key].age}
              <br />
              gender: {item[key].gender}
            </Link>
          );
        })}
    </div>
  );
}
