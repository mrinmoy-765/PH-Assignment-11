const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ncoxxcy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();

    const userCollection = client.db("CarRental").collection("Users");
    const carCollection = client.db("CarRental").collection("carCollection");

    //create User
    app.post("/users", async (req, res) => {
      const newUser = req.body;
      // console.log(newUser);
      const result = await userCollection.insertOne(newUser);
      res.send(result);
    });

    //get user by email retrived from firebase
    app.get("/users", async (req, res) => {
      try {
        const email = req.query.email;
        if (!email)
          return res.status(400).send({ message: "Email is required" });

        const user = await userCollection.findOne({ email }); // ✅ correct variable

        if (!user) return res.status(404).send({ message: "User not found" });

        res.send(user);
      } catch (error) {
        console.error("Error in /users route:", error);
        res.status(500).send({ message: "Internal Server Error" });
      }
    });

    //add cars
    app.post("/addCar", async (req, res) => {
      const newCar = req.body;
      // console.log(newCar);
      const result = await carCollection.insertOne(newCar);
      res.send(result);
    });

    //get logged in users all cars
    app.get("/carsByEmail", async (req, res) => {
      const email = req.query.email;
      if (!email) {
        return res.status(400).send({ error: "Email is required" });
      }

      const query = { email: email };
      const result = await carCollection.find(query).toArray();
      res.send(result);
    });

    // Update car info
    app.put("/cars/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedCar = req.body;

      console.log("Updating Car with filter:", filter);
      console.log("New data:", updatedCar);

      const updateDoc = {
        $set: {
          model: updatedCar.model,
          price: updatedCar.price,
          availability: updatedCar.availability,
          registration: updatedCar.registration,
          features: updatedCar.features,
          description: updatedCar.description,
          imageUrl: updatedCar.imageUrl,
          location: updatedCar.location,
        },
      };

      try {
        const result = await carCollection.updateOne(filter, updateDoc);
        res.send(result);
      } catch (error) {
        console.error("Error updating car:", error);
        res.status(500).send({ error: "Failed to update car" });
      }
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("car rental server is running");
});

app.listen(port, () => {
  console.log(`car rental is running on port: ${port}`);
});
