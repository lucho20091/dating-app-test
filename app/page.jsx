import { prisma } from "@/lib/prisma";
import { stackServerApp } from "@/stack/server";
import { redirect } from "next/navigation";
export default async function Home() {
  const stackUser = await stackServerApp.getUser();

  if (!stackUser) {
    redirect("/sign-in");
  }

  const existingUser = await prisma.user.findUnique({
    where: { id: stackUser.id },
  });

  if (!existingUser) {
    redirect("/create-user");
  }
  return (
    <div>
      <p>home</p>
    </div>
  );
}
