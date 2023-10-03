import { db } from "@/lib/db";

export default async function Home() {
  await db.set("hello", "hello1");

  return (
    <div className="mx-auto mt-10 max-w-lg border text-center">
      <h1>Hello Tailwindcss</h1>
    </div>
  );
}
