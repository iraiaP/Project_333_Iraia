import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI!;

export async function POST(request: Request) {
  const { email, password, accountType } = await request.json();

  const client = new MongoClient(uri);

  await client.connect();
  console.log("Connected to MongoDB");
  const db = client.db("Db_333");

 const user = await db
  .collection(
    accountType === "trainer" //if accountType is "trainer", use the "trainer_acc" collection, otherwise use the "Clients" collection
    ? "trainer_acc" : 
    "Clients")
    .findOne({email: email, password: password});
  
    console.log("user Found:");

  if (!user) {
    return Response.json(
      { error: "Invalid login" },
      { status: 401 }
    );
  }

  return Response.json({
    user,
  });
}