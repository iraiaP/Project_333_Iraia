import { MongoClient, ObjectId } from "mongodb";
import { NextResponse } from "next/server";

const uri = process.env.MONGODB_URI!;

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

    export async function PUT( request: Request,
                            { params }: { params: Promise<{ id: string }> }
    ) {
    const client = await MongoClient.connect(uri);
    const db = client.db("Db_333");

    const { id } = await params;

    const {
        name,
        email,
        city,
        suburb,
        bio,
        password,
    } = await request.json();

    const result = await db.collection("trainer_acc").updateOne(
        {
        _id: new ObjectId(id),
        },
        {
        $set: {
            name,
            email,
            city,
            suburb,
            bio,
            password,
        },
        }
    );
    if (result.matchedCount === 0) {
        return NextResponse.json(
        { error: "Trainer not found" },
        { status: 404 }
    );
    }

    return NextResponse.json({
        success: true,
    });
}
