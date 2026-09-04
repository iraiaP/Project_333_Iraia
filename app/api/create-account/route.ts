import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI!;

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const client = new MongoClient(uri);
    await client.connect();

    const db = client.db("gymdb");

    await db.collection("users").insertOne({
      name: body.name,
      email: body.email,
      password: body.password,
      accountType: body.accountType,
      createdAt: new Date(),
    });

    await client.close();

    return Response.json({ message: "Account created" });
  } catch (error) {
    return Response.json(
      { message: "Error creating account" },
      { status: 500 }
    );
  }
}