import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
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
  return <div>matches</div>;
}
