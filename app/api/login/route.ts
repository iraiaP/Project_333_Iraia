import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI!;

export async function POST(request: Request) {
  const { email } = await request.json();

  const client = new MongoClient(uri);

  await client.connect();
  console.log("Connected to MongoDB");
  const db = client.db("Db_333");

 const user = await db.collection("Clients").findOne({});

  console.log("Found:", user);

  return Response.json({
    user,
  });
}