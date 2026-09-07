import { MongoClient } from "mongodb";
import { Client } from "@/models/Client";
import { Trainer } from "@/models/Trainer";

const uri = process.env.MONGODB_URI!;
let user: Client | Trainer;
//TO DO: Add data validation and error handling for the request body.
export async function POST(request: Request) {
  try {
    const body = await request.json();

      console.log("Starting MongoDB connection...");

      const client = new MongoClient(uri);

      console.log("Client created.");

      await client.connect();

      console.log("Connected successfully!");

      const db = client.db("Db_333");

      console.log("Using database:", db.databaseName);


    // Check if the account type is valid
    if(body.accountType === "client") {
      user = new Client(body.name, body.email, body.password);

      await db.collection("Clients").insertOne({
      name: body.name,
      email: body.email,
      password: body.password,
      createdAt: new Date(),
      });

    } else if(body.accountType === "trainer") {
      user = new Trainer(body.name, body.email, body.password);
      await db.collection("trainer_acc").insertOne({
        name: body.name,
        email: body.email,
        password: body.password,
        createdAt: new Date(),
      });
    }

    await client.close();

    return Response.json({ message: "Account created" });
  } catch (error) {
  console.error("API ERROR:", error);
  return Response.json(
    { message: "Error creating account" },
    { status: 500 }
    );
  } 
}

