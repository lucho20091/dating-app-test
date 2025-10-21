import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
export default async function page() {
  const user = await getCurrentUser();
  const existingUser = await prisma.user.findUnique({
    where: { id: user.id },
  });
  const myLikes = await prisma.user.findUnique({
    where: { id: existingUser.id },
    include: {
      likesSent: { include: { toUser: true, fromUser: true } },
      likesReceived: { include: { fromUser: true, toUser: true } },
    },
  });

  console.log("my likes", myLikes);

  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex flex-col items-center justify-center">
        <h2>Likes Sent</h2>
        {myLikes.likesSent.length > 0 &&
          myLikes.likesSent.map((item) => (
            <div key={item.id}>
              {item.fromUser.username} sent like to {item.toUser.username}
            </div>
          ))}
      </div>
      <div className="flex flex-col items-center justify-center">
        <h2>Likes Received</h2>
        {myLikes.likesReceived.length > 0 &&
          myLikes.likesReceived.map((item) => (
            <div key={item.id}>
              {item.toUser.username} received like from {item.fromUser.username}
            </div>
          ))}
      </div>
    </div>
  );
}
