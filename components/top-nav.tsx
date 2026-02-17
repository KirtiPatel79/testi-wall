import Link from "next/link";
import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";

export async function TopNav() {
  const session = await auth();
  const email = session?.user?.email ?? "";
  const profileLabel = email ? email.split("@")[0] : "Account";
  const profileInitial = profileLabel.slice(0, 1).toUpperCase();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/60 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-slate-900">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-600 text-white">
            <span className="text-lg">T</span>
          </div>
          TestiWall
        </Link>
        <nav className="flex items-center gap-4">
          {session?.user ? (
            <>
              <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm md:flex">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-600 text-[10px] font-bold text-white">
                  {profileInitial}
                </div>
                <span className="max-w-[120px] truncate font-medium text-slate-700">{profileLabel}</span>
              </div>
              <Link href="/app/projects">
                <Button variant="ghost" size="sm" className="font-medium">
                  Dashboard
                </Button>
              </Link>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <Button type="submit" variant="outline" size="sm" className="font-medium">
                  Logout
                </Button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900">
                Login
              </Link>
              <Link href="/signup">
                <Button size="sm" className="bg-sky-600 font-medium hover:bg-sky-700">
                  Get started
                </Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
