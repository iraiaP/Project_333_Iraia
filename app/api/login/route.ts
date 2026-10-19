
import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";
import { createSession } from "@/lib/session";

const uri = process.env.MONGODB_URI!;

export async function POST(request: Request) {
  const { email, password, accountType } = await request.json();

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db("Db_333");

    // Select collection based on account type
    if (accountType !== "client" && accountType !== "trainer") {
      return Response.json(
        { error: "Invalid account type" },
        { status: 400 }
      );
    }

    if (typeof email !== "string" ||
        typeof password !== "string") {
      return Response.json(
        { error: "Invalid login details" },
        { status: 400 }
      );
    }

    const collectionName =
      accountType === "trainer" ? "trainer_acc" : "Clients";

    // Find user by email
    const user = await db
      .collection(collectionName)
      .findOne({ email: email.trim().toLowerCase() });

    // Check if user exists
    if (!user) {
      return Response.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Compare entered password with hashed password
    const passwordMatches = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatches) {
      return Response.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }
    //creates HTTP-only session cookie after the password has been verified.
    await createSession(
      user._id.toString(),
      accountType
    );

    // Return user details without password
    return Response.json({
      user: {
        _id: user._id.toString(),
        firstName: user.firstName,
        lastName: user.lastName,
        name: user.name,
        email: user.email,
        accountType,
      },
    });

  } catch (error) {
    console.error("Login error:", error);

    return Response.json(
      { error: "Server error" },
      { status: 500 }
    );

  } finally {
    await client.close();
  }
}
