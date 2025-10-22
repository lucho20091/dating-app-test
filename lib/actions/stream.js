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

export async function createOrGetChannel(otherUserId) {
  const user = await stackServerApp.getUser();

  const existingUser = await prisma.user.findUnique({
    where: { id: user.id },
  });

  // Check if a match exists between the two users
  const match = await prisma.match.findFirst({
    where: {
      OR: [
        { user1Id: user.id, user2Id: otherUserId },
        { user1Id: otherUserId, user2Id: user.id },
      ],
    },
  });
  if (!match) {
    throw new Error("Users are not matched. Cannot create chat channel.");
  }
  const sortedIds = [user.id, otherUserId].sort();
  const combinedIds = sortedIds.join("_");

  let hash = 0;
  for (let i = 0; i < combinedIds.length; i++) {
    const char = combinedIds.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  const channelId = `match_${Math.abs(hash).toString(36)}`;

  const serverClient = StreamChat.getInstance(
    process.env.NEXT_PUBLIC_STREAM_API_KEY,
    process.env.STREAM_API_SECRET
  );
  const otherUserData = await prisma.user.findUnique({
    where: { id: otherUserId },
  });

  if (!otherUserData) {
    throw new Error("Other user not found");
  }

  // Ensure both users exist in Stream
  await serverClient.upsertUsers([
    {
      id: user.id,
      name: existingUser.username || "Unknown User",
      image: existingUser.avatar_url || undefined,
    },
    {
      id: otherUserId,
      name: otherUserData.username,
      image: otherUserData.avatar_url || undefined,
    },
  ]);

  // Create or get the channel
  const channel = serverClient.channel("messaging", channelId, {
    members: [user.id, otherUserId],
    created_by_id: user.id,
  });

  try {
    await channel.create();
    console.log("Channel created successfully:", channelId);
  } catch (error) {
    if (!error.message?.includes("already exists")) {
      console.error("Channel creation error:", error);
      throw error;
    }
  }

  return {
    success: true,
    channelType: "messaging",
    channelId,
  };
}
