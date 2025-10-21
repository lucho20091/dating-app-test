import { SignIn } from "@stackframe/stack";
import { stackServerApp } from "@/stack/server";
import { redirect } from "next/navigation";

export default async function page() {
  const user = await stackServerApp.getUser();
  if (user) {
    redirect("/");
  }
  return (
    <div className="mt-4 flex items-center justify-center">
      <div>
        <SignIn />
      </div>
    </div>
  );
}
