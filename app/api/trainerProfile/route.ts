import { MongoClient, ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

const uri = process.env.MONGODB_URI!;
//This route contains GET for one of my page.tsx's (assuming same as below)
// and Put for Trainer profile updates via trainer-profile/page.tsx 
export async function GET(request: Request,
                        { params }: { params: Promise<{ id: string }> }) {
    
    const client = await MongoClient.connect(uri);
    const db = client.db("Db_333");

    const { id } = await params;

    const trainer = await db.collection("trainer_acc").findOne({
        _id: new ObjectId(id),
    });

    return NextResponse.json(trainer);
    }



export async function PUT(request: Request) {
  const session = await getSession();

  // Check trainer is logged in
  if (!session || session.accountType !== "trainer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { firstName, lastName, email, city, suburb, bio } =
    await request.json();

  const client = await MongoClient.connect(uri);
  const db = client.db("Db_333");

  // Update the logged-in trainer's profile
  const result = await db.collection("trainer_acc").updateOne(
    { _id: new ObjectId(session.userId) },
    {
      $set: {
        firstName,
        lastName,
        email,
        city,
        suburb,
        bio,
      },
    }
  );

  await client.close();

  if (result.matchedCount === 0) {
    return NextResponse.json(
      { error: "Trainer not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true });
}
