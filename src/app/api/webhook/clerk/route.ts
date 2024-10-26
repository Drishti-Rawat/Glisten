import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/clerk-sdk-node";  // Updated import
import { createUser, deleteUser, updateUser } from "@/lib/actions/user.actions";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occurred -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occurred", {
      status: 400,
    });
  }

  const eventType = evt.type;

  if (eventType === "user.created") {
    try {
      const { id, email_addresses, image_url, first_name, last_name, username } = evt.data;
      
      console.log("Creating user with data:", {
        id,
        email: email_addresses?.[0]?.email_address,
        username,
        firstName: first_name,
        lastName: last_name
      });

      const user = {
        clerkId: id,
        email: email_addresses?.[0]?.email_address,
        username: username || email_addresses?.[0]?.email_address?.split('@')[0] || '',
        firstName: first_name || '',
        lastName: last_name || '',
        photo: image_url,
        role: "user"  // Adding default role
      };

      const newUser = await createUser(user);
      console.log("User created in database:", newUser);

      if (newUser) {
        try {
          await clerkClient.users.updateUserMetadata(id, {
            publicMetadata: {
              userid: newUser._id.toString(),  // Convert ObjectId to string
              role: "user"
            }
          });
          console.log("Clerk metadata updated successfully");
        } catch (metadataError) {
          console.error("Error updating Clerk metadata:", metadataError);
        }
      }

      return NextResponse.json(
        {
          message: "User created",
          user: newUser,
        },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error in user.created webhook:", error);
      return NextResponse.json(
        {
          message: "Error creating user",
          error: error instanceof Error ? error.message : String(error),
        },
        { status: 500 }
      );
    }
  }

  if (eventType === "user.updated") {
    try {
      const { id, image_url, first_name, last_name, username } = evt.data;

      const user = {
        username: username || '',
        firstName: first_name || '',
        lastName: last_name || '',
        photo: image_url
      };

      const updatedUser = await updateUser(id, user);

      return NextResponse.json(
        {
          message: "User updated",
          user: updatedUser,
        },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error in user.updated webhook:", error);
      return NextResponse.json(
        {
          message: "Error updating user",
          error: error instanceof Error ? error.message : String(error),
        },
        { status: 500 }
      );
    }
  }

  if (eventType === "user.deleted") {
    try {
      const { id } = evt.data;
      const deletedUser = await deleteUser(id!);
      return NextResponse.json(
        {
          message: "User deleted",
          user: deletedUser,
        },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error in user.deleted webhook:", error);
      return NextResponse.json(
        {
          message: "Error deleting user",
          error: error instanceof Error ? error.message : String(error),
        },
        { status: 500 }
      );
    }
  }

  return new Response("", { status: 200 });
}