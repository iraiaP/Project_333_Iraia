
import { MongoClient, ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

const uri = process.env.MONGODB_URI!;

export async function GET() {
  const session = await getSession();

  if (!session || session.accountType !== "client") {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();

    const db = client.db("Db_333");

    const user = await db.collection("Clients").findOne(
      { _id: new ObjectId(session.userId) },
      {
        projection: {
          firstName: 1,
          lastName: 1,
          email: 1,
        },
      }
    );

    if (!user) {
      return NextResponse.json(
        { error: "Client not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } finally {
    await client.close();
  }
}

export async function PATCH(request: Request) {
  const session = await getSession();

  if (!session || session.accountType !== "client") {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { firstName, lastName, email } = await request.json();

  if (
    typeof firstName !== "string" ||
    typeof lastName !== "string" ||
    typeof email !== "string" ||
    !firstName.trim() ||
    !lastName.trim() ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  ) {
    return NextResponse.json(
      { error: "Please enter valid profile details" },
      { status: 400 }
    );
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();

    const db = client.db("Db_333");
    const collection = db.collection("Clients");

    const normalizedEmail = email.trim().toLowerCase();

    const existing = await collection.findOne({
      email: normalizedEmail,
      _id: { $ne: new ObjectId(session.userId) },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Email is already in use" },
        { status: 409 }
      );
    }

    const result = await collection.updateOne(
      { _id: new ObjectId(session.userId) },
      {
        $set: {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: normalizedEmail,
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Client not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Profile updated",
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: normalizedEmail,
    });
  } finally {
    await client.close();
  }
}
