import { fetchRedis } from "@/app/helpers/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { addFriendValidator } from "@/lib/validations/add-friend";
import { AxiosError } from "axios";
import { getServerSession } from "next-auth";
import z from "zod";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    const { email: emailToAdd } = addFriendValidator.parse(email);

    const idToAdd = (await fetchRedis(
      "get",
      `user:email:${emailToAdd}`,
    )) as string;

    if (!idToAdd) {
      return new Response("This person does not exist", { status: 400 });
    }

    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    if (idToAdd === session.user.id) {
      return new Response("You cannot addding yourself as a friend", {
        status: 400,
      });
    }

    // check if user already added
    const isAlreadyAdded = (await fetchRedis(
      "sismember",
      `user:${idToAdd}:incoming_friend_requests`,
      session.user.id,
    )) as 0 | 1;

    if (isAlreadyAdded) {
      return new Response("Already added this user", { status: 400 });
    }

    const isAlreadyFriends = (await fetchRedis(
      "sismember",
      `user:${idToAdd}:friends`,
      idToAdd,
    )) as 0 | 1;

    if (isAlreadyFriends) {
      return new Response("Already friends with this user", { status: 400 });
    }

    // valid request, send friend request
    db.sadd(`user:${idToAdd}:incoming_friend_requests`, session.user.id);

    return new Response("OK");
  } catch (err) {
    if (err instanceof z.ZodError) {
      return new Response("Invalid request payload", { status: 422 });
    }

    return new Response("Invalid request", { status: 400 });
  }
}
