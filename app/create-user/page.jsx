import { prisma } from "@/lib/prisma";

import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
export default async function page() {
  const user = await getCurrentUser();
  const existingUser = await prisma.user.findUnique({
    where: { id: user.id },
  });

  if (existingUser) {
    redirect("/");
  }
  async function handleCreateNewAccount(formData) {
    "use server";
    const username = formData.get("username")?.trim();
    const gender = formData.get("gender");
    const bio = formData.get("bio");
    const age = Number(formData.get("age"));
    const preferences = formData.get("preferences");
    console.log(username, gender, bio, age, preferences);
    await prisma.user.create({
      data: {
        id: user.id,
        username,
        avatar_url: user.profileImageUrl,
        gender,
        bio,
        age,
        preferences,
      },
    });
    redirect("/");
  }

  return (
    <div>
      <form action={handleCreateNewAccount}>
        <input type="text" name="username" placeholder="username" />
        <input type="text" name="gender" placeholder="gender" />
        <input type="text" name="age" placeholder="age" />
        <input type="text" name="preferences" placeholder="preferences" />
        <input type="text" name="bio" placeholder="bio" />
        <button>submit</button>
      </form>
    </div>
  );
}
