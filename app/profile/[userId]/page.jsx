import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
export default async function page({ params }) {
  const { userId } = await params;
  const user = await getCurrentUser();
  async function checkUser() {
    try {
      const userPrisma = await prisma.user.findUnique({
        where: { id: userId },
      });
      return userPrisma;
    } catch (e) {
      return;
    }
  }
  const userInfo = await checkUser();

  if (userId === user.id) {
    const profileImageStack = user.profileImageUrl;
    const profileImagePrisma = userInfo.avatar_url;
    console.log("profileImagePrisma", profileImagePrisma);
    console.log("profileImageStack", profileImageStack);
    if (profileImagePrisma !== profileImageStack) {
      await prisma.user.update({
        where: {
          id: userInfo.id,
        },
        data: {
          avatar_url: profileImageStack,
        },
      });
    }
  }
  async function handleUpdateAccount(formData) {
    "use server";
    const username = formData.get("username")?.trim();
    const gender = formData.get("gender");
    const bio = formData.get("bio");
    const age = Number(formData.get("age"));
    const preferences = formData.get("preferences");
    console.log(username, gender, bio, age, preferences);
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        username,
        gender,
        bio,
        age,
        preferences,
      },
    });
  }

  return (
    <>
      {user.id === userInfo.id ? (
        <form
          className="bg-white text-black max-w-xs mx-auto flex flex-col justify-items items-left mt-4"
          action={handleUpdateAccount}
        >
          <img
            src={userInfo.avatar_url}
            className="w-32 h-32 rounded-full border-black border-1 mx-auto"
          />
          <div className="flex items-center justify-center">
            <label htmlFor="username" className="p-2">
              username
            </label>
            <input
              defaultValue={userInfo.username}
              id="username"
              name="username"
              className="flex-1 px-2 py-2 border-black border-1"
            />
          </div>
          <div className="flex items-center justify-center">
            <label htmlFor="gender" className="p-2">
              gender
            </label>
            <input
              defaultValue={userInfo.gender}
              id="gender"
              name="gender"
              className="flex-1 px-2 py-2 border-black border-1"
            />
          </div>
          <div className="flex items-center justify-center">
            <label htmlFor="age" className="p-2">
              age
            </label>
            <input
              defaultValue={userInfo.age}
              id="age"
              name="age"
              className="flex-1 px-2 py-2 border-black border-1"
            />
          </div>
          <div className="flex items-center justify-center">
            <label htmlFor="bio" className="p-2">
              bio
            </label>
            <input
              defaultValue={userInfo.bio}
              id="bio"
              name="bio"
              className="flex-1 px-2 py-2 border-black border-1"
            />
          </div>
          <div className="flex items-center justify-center">
            <label htmlFor="preferences" className="p-2">
              preferences
            </label>
            <input
              defaultValue={userInfo.preferences}
              id="preferences"
              name="preferences"
              className="flex-1 px-2 py-2 border-black border-1"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-200 w-32 px-2 py-4 cursor-pointer ml-auto mt-4"
          >
            save changes
          </button>
        </form>
      ) : (
        <div className="max-w-xs mx-auto flex flex-col justify-items items-center mt-4">
          <img
            src={userInfo.avatar_url}
            className="w-32 h-32 rounded-full border-black border-1"
          />
          <div className="flex items-center justify-center gap-4">
            <span>username</span>
            <span>{userInfo.username}</span>
          </div>
          <div className="flex items-center justify-center gap-4">
            <span>gender</span>
            <span>{userInfo.gender}</span>
          </div>
          <div className="flex items-center justify-center gap-4">
            <span>age</span>
            <span>{userInfo.age}</span>
          </div>
          <div className="flex items-center justify-center gap-4">
            <span>bio</span>
            <span>{userInfo.bio}</span>
          </div>
          <div className="flex items-center justify-center gap-4">
            <span>preferences</span>
            <span>{userInfo.preferences}</span>
          </div>
        </div>
      )}
    </>
  );
}
