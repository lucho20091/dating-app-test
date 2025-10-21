import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
export default async function page() {
  const user = await getCurrentUser();
  const existingUser = await prisma.user.findUnique({
    where: { id: user.id },
  });
  const possibleMatches = await prisma.user.findMany({
    where: {
      gender: existingUser.preferences,
      preferences: existingUser.gender,
    },
  });

  async function handleCreateLike(formData) {
    "use server";
    const likedPerson = formData.get("id");
    await prisma.like.create({
      data: {
        fromUserId: existingUser.id,
        toUserId: likedPerson,
      },
    });
    const mutualLike = await prisma.like.findUnique({
      where: {
        fromUserId_toUserId: {
          fromUserId: likedPerson,
          toUserId: existingUser.id,
        },
      },
    });
    console.log("mutual like", mutualLike);
    if (mutualLike) {
      const res = await prisma.match.create({
        data: {
          user1Id: existingUser.id,
          user2Id: likedPerson,
        },
      });
    }
  }

  console.log(possibleMatches);
  return (
    <div>
      {possibleMatches.map((item) => (
        <div key={item.id}>
          <form action={handleCreateLike}>
            <input type="text" readOnly value={item.id} name="id" hidden />
            <input type="text" readOnly value={item.username} />
            <input type="text" readOnly value={item.gender} />
            <input type="text" readOnly value={item.age} />
            <button type="submit" className="bg-green-200">
              Like
            </button>
            <button type="button" className="bg-red-200">
              Pass
            </button>
          </form>
        </div>
      ))}
    </div>
  );
}
