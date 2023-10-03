import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { notFound } from "next/navigation";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getServerSession(authOptions);
  if (!session) notFound();
  return (
    <div className="flex h-screen w-full">
      <div className="boder-r flex h-full w-full max-w-xs flex-col gap-y-5 overflow-y-auto border-gray-200 bg-white px-6">
        <Link href="/dashboard" className="flex h-16 shrink-0 items-center">
          Logo
        </Link>
      </div>
      {children}
    </div>
  );
};

export default DashboardLayout;
