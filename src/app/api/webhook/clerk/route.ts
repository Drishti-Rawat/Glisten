import { Webhook } from "svix";
import { headers } from "next/headers";
import { clerkClient, WebhookEvent } from "@clerk/nextjs/server";
import { createUser, updateUser, deleteUser } from "@/lib/actions/user.actions";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  const { id } = evt.data;
  console.log("id", id);
  const eventType = evt.type;

  if (eventType === "user.created") {
    const { id, email_addresses, image_url, first_name, last_name, username } =
      evt.data;

    const user = {
      clerkId: id,
      email: email_addresses[0].email_address,
      username: username!,
      firstName: first_name!,
      lastName: last_name!,
      photo: image_url,
      role: "user",
    };

    const newUser = await createUser(user);
    console.log("User created in database:", newUser);

    if (newUser) {
        const client = await clerkClient();
        await client.users.updateUserMetadata(id, {
          publicMetadata: {
            userid: newUser._id,
            role: newUser.role,
          },
        });
    }

    return NextResponse.json(
      {
        message: "User created",
        user: newUser,
      },
      {
        status: 200,
      }
    );
  }

  if (eventType === "user.updated") {
    try {
      const { id, image_url, first_name, last_name, username } = evt.data;

      const user = {
        username: username!,
        firstName: first_name!,
        lastName: last_name!,
        photo: image_url,
      };

      const updatedUser = await updateUser(id, user);

      return NextResponse.json(
        {
          message: "User updated",
          user: updatedUser,
        },
        {
          status: 200,
        }
      );
    } catch (error) {
      console.error("Error handling user.created event:", error);
      return NextResponse.json(
        {
          message: "Error creating user",
          error: error instanceof Error ? error.message : String(error),
        },
        { status: 500 }
      );
    }
  }

  if (eventType === "user.deleted") {
    const { id } = evt.data;
    const deletedUser = await deleteUser(id!);
    return NextResponse.json(
      {
        message: "User deleted",
        user: deletedUser,
      },
      {
        status: 200,
      }
    );
  }

  return new Response("", {
    status: 200,
  });
}