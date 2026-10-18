
import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";

const uri = process.env.MONGODB_URI!;

export async function POST(request: Request) {
  let client: MongoClient | undefined;

  try {
    // 1. Get the data from the create account form
    const body = await request.json();

    const {
      firstName,
      lastName,
      email,
      password,
      accountType,
      city,
      suburb,
    } = body;

    // 2. Validate required fields
    if (
      typeof firstName !== "string" ||
      typeof lastName !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string" ||
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !password
    ) {
      return Response.json(
        { message: "Please fill in all required fields" },
        { status: 400 }
      );
    }

    // 3. Validate account type
    if (accountType !== "client" && accountType !== "trainer") {
      return Response.json(
        { message: "Invalid account type" },
        { status: 400 }
      );
    }

    // 4. Validate trainer location
    if (
      accountType === "trainer" &&
      (
        typeof city !== "string" ||
        typeof suburb !== "string" ||
        !city.trim() ||
        !suburb.trim()
      )
    ) {
      return Response.json(
        { message: "City and suburb are required for trainers" },
        { status: 400 }
      );
    }

    // 5. Connect to MongoDB
    client = new MongoClient(uri);
    await client.connect();

    console.log("Connected to MongoDB");

    const db = client.db("Db_333");

    // Choose collection based on account type
    const collectionName =
      accountType === "trainer" ? "trainer_acc" : "Clients";

    const collection = db.collection(collectionName);

    // 6. Check whether email already exists
    const existingUser = await collection.findOne({
      email: email.trim().toLowerCase(),
    });

    if (existingUser) {
      return Response.json(
        { message: "Email already registered" },
        { status: 409 }
      );
    }

    // 7. Hash password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // 8. Create the user document
    const newUser = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      createdAt: new Date(),
      ...(accountType === "trainer" && {
        city: city.trim(),
        suburb: suburb.trim(),
      }),
    };

    // 9. Save user to MongoDB
    await collection.insertOne(newUser);

    console.log("Account created successfully");

    return Response.json(
      { message: "Account created" },
      { status: 201 }
    );

  } catch (error) {
    console.error("API ERROR:", error);

    return Response.json(
      { message: "Error creating account" },
      { status: 500 }
    );

  } finally {
    //  close the database connection
    if (client) {
      await client.close();
    }
  }
}
