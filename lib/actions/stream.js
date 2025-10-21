"use server";

import { StreamChat } from "stream-chat";
import { stackServerApp } from "@/stack/server";
import { prisma } from "@/lib/prisma";

export async function getStreamUserToken() {
  const user = await stackServerApp.getUser();

  const existingUser = await prisma.user.findUnique({
    where: { id: user.id },
  });

  const serverClient = StreamChat.getInstance(
    process.env.NEXT_PUBLIC_STREAM_API_KEY,
    process.env.STREAM_API_SECRET
  );
  const token = serverClient.createToken(existingUser.id);

  await serverClient.upsertUser({
    id: existingUser.id,
    name: existingUser.username,
    image: existingUser.avatar_url || undefined,
  });

  return {
    token,
    userId: existingUser.id,
    userName: existingUser.username,
    userImage: existingUser.avatar_url || undefined,
  };
}
