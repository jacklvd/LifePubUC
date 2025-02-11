import { auth } from "@/auth";
import { redirect } from "next/navigation";

const LandingPage = async () => {
  const session = await auth();

  if (session) redirect("/sign-in");
  return (
    <div>LandingPage</div>
  )
}

export default LandingPage