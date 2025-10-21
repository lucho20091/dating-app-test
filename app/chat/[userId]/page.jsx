"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { stackClientApp } from "@/stack/client";
import ChatHeader from "@/components/ChatHeader";
import StreamChatInterface from "@/components/StreamChatInterface";

export default function ChatPage() {
  const [user, setUser] = useState(null);
  const [userPrisma, setUserPrisma] = useState(null);
  const [otherUser, setOtherUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const chatInterfaceRef = useRef(null);

  const router = useRouter();
  const params = useParams();
  const userIdParam = params.userId;

  // Load current signed-in user
  useEffect(() => {
    async function loadUser() {
      try {
        const currentUser = await stackClientApp.getUser();
        if (!currentUser) {
          router.push("/sign-in");
          return;
        }
        setUser(currentUser);
      } catch (err) {
        console.error("Error loading current user:", err);
      }
    }
    loadUser();
  }, [router]);

  // Load other user from API
  useEffect(() => {
    if (!userIdParam) return;
    async function fetchOtherUser() {
      try {
        const res = await fetch(`/api/users/${userIdParam}`);
        if (!res.ok) throw new Error("Failed to fetch other user");
        const data = await res.json();
        setOtherUser(data);
      } catch (error) {
        console.error("Error fetching other user:", error);
      }
    }
    fetchOtherUser();
  }, [userIdParam]);

  // Load Prisma user record of the current user
  useEffect(() => {
    if (!user?.id) return;
    async function fetchUserPrisma() {
      try {
        const res = await fetch(`/api/users/${user.id}`);
        if (!res.ok) throw new Error("Failed to fetch Prisma user");
        const data = await res.json();
        setUserPrisma(data);
      } catch (error) {
        console.error("Error fetching Prisma user:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchUserPrisma();
  }, [user?.id]);

  if (loading) return <div>Loading chat...</div>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Chat Page</h1>
      <ChatHeader
        user={otherUser}
        onVideoCall={() => chatInterfaceRef?.current?.handleVideoCall()}
      />
      <StreamChatInterface otherUser={otherUser} />
    </div>
  );
}
