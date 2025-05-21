const express = require("express");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

//middleware
app.use(cookieParser());
app.use(
  cors({
    origin: ["https://elaborate-kangaroo-16f8b1.netlify.app"],
    credentials: true,
  })
);

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
    const bookingCollection = client
      .db("CarRental")
      .collection("bookingCollection");

    const verifyToken = (req, res, next) => {
      const token = req.cookies.accessToken;
      //  console.log("indise verify token", token);

      if (!token) return res.status(401).send("Unauthorized");

      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).send("Forbidden");
        req.user = decoded;
        next();
      });
    };

    //Auth related APIs
    app.post("/jwt", async (req, res) => {
      const user = req.body;
      // Create JWT token
      const accessToken = jwt.sign(user, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      // Set cookies
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      });
      res.send({ sucess: true });
    });

    //clear cookie
    app.post("/logout", (req, res) => {
      res.clearCookie("accessToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      });
      return res.status(200).json({ message: "Logged out successfully" });
    });

    //create User
    app.post("/users", async (req, res) => {
      const newUser = req.body;
      // console.log(newUser);
      const result = await userCollection.insertOne(newUser);
      res.send(result);
    });

    //get user by email retrived from firebase
    app.get("/users", verifyToken, async (req, res) => {
      try {
        const email = req.query.email;
        if (!email)
          return res.status(400).send({ message: "Email is required" });

        const user = await userCollection.findOne({ email });

        if (!user) return res.status(404).send({ message: "User not found" });

        res.send(user);
      } catch (error) {
        console.error("Error in /users route:", error);
        res.status(500).send({ message: "Internal Server Error" });
      }
    });

    //add cars
    app.post("/addCar", verifyToken, async (req, res) => {
      const newCar = {
        ...req.body,
        createdAt: new Date(), // Add timestamp here
      };

      try {
        const result = await carCollection.insertOne(newCar);
        res.send(result);
      } catch (err) {
        console.error("Error adding car:", err);
        res.status(500).json({ error: "Failed to add car" });
      }
    });

    //get logged in users all cars
    app.get("/carsByEmail/:email", verifyToken, async (req, res) => {
      const email = req.params.email;
      //  console.log("cookies in get car", req.cookies.accessToken);

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
          brand: updatedCar.brand,
          engine: updatedCar.engine,
          year: updatedCar.year,
          mileage: updatedCar.mileage,
          vehicleType: updatedCar.vehicleType,
          color: updatedCar.color,
          transmission: updatedCar.transmission,
          fuelType: updatedCar.fuelType,
          seats: updatedCar.seats,
          doors: updatedCar.doors,
          luggageCapacity: updatedCar.luggageCapacity,
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

    //delete car
    app.delete("/cars/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await carCollection.deleteOne(query);
        res.json(result); // Ensure you're returning JSON
      } catch (err) {
        console.error("Delete error:", err);
        res.status(500).json({ message: "Server error", error: err.message });
      }
    });

    // GET available cars
    app.get("/cars/available", async (req, res) => {
      try {
        const cars = await carCollection
          .find({ availability: "Available" })
          .toArray();
        res.json(cars);
      } catch (err) {
        console.error("Error fetching available cars:", err);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    //get specific car details
    app.get("/details/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await carCollection.findOne(query);
      res.send(result);
    });

    // GET recent available cars (limit 8)
    app.get("/cars/recent", async (req, res) => {
      try {
        const cars = await carCollection
          .find({ availability: "Available" })
          .sort({ createdAt: -1 }) // Sort by newest first
          .limit(8)
          .toArray();

        res.json(cars);
      } catch (err) {
        console.error("Error fetching recent cars:", err);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    // Create a booking and increment bookingCount in carCollection
    app.post("/bookings", async (req, res) => {
      const newBooking = req.body;

      try {
        // Insert new booking
        const bookingResult = await bookingCollection.insertOne(newBooking);

        // Extract carId from the new booking
        const carId = newBooking.carId;

        // Increment bookingCount in carCollection
        const updateResult = await carCollection.updateOne(
          { _id: new ObjectId(carId) },
          { $inc: { bookingCount: 1 } }
        );

        res.send({
          bookingResult,
          bookingCountUpdate: updateResult,
        });
      } catch (error) {
        console.error("Error during booking:", error);
        res.status(500).send({ error: "Booking failed" });
      }
    });

    // Get bookings by user email
    app.get("/bookingByEmail", verifyToken, async (req, res) => {
      const email = req.query.email;
      if (!email) {
        return res.status(400).send({ error: "Email is required" });
      }

      const query = { "userInfo.email": email };
      const result = await bookingCollection
        .find(query)
        .sort({ _id: -1 })
        .toArray();
      res.send(result);
    });

    // Update booking
    app.put("/bookings/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedBooking = req.body;

      // console.log("Updating Booking with filter:", filter);
      // console.log("New data:", updatedBooking);

      const updateDoc = {
        $set: {
          fromDate: updatedBooking.fromDate,
          toDate: updatedBooking.toDate,
        },
      };

      const result = await bookingCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    //delete booking
    app.delete("/booking/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await bookingCollection.deleteOne(query);
      res.send(result);
    });

    // Get Car IDs by Owner Email
    app.get("/owner-cars/:email", async (req, res) => {
      const email = req.params.email;

      //   console.log("cookies in get car", req.cookies.accessToken);

      try {
        const cars = await carCollection.find({ email: email }).toArray();
        const carIds = cars.map((car) => car._id.toString());
        res.send(carIds);
      } catch (error) {
        res.status(500).send({ error: "Failed to fetch owner's car IDs" });
      }
    });

    // Get Bookings with Pending/confirmed/cancelled Status for Car IDs
    app.post("/bookings/pending", verifyToken, async (req, res) => {
      const { carIds } = req.body;

      //  console.log("cookies in booking", req.cookies.accessToken);
      try {
        const bookings = await bookingCollection
          .find({ carId: { $in: carIds } })
          .sort({ _id: -1 }) // 🔽 descending, newest first
          .toArray();

        res.send(bookings);
      } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Failed to fetch  bookings" });
      }
    });

    // update booking status
    app.patch("/bookings/:id/status", async (req, res) => {
      const { id } = req.params;
      const { status } = req.body;

      try {
        const result = await bookingCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { bookingStatus: status } }
        );

        res.send(result);
      } catch (err) {
        console.error("Error updating booking status:", err);
        res.status(500).send({ error: "Failed to update booking status" });
      }
    });

    // GET chart
    app.get("/cars/charts", async (req, res) => {
      try {
        const cars = await carCollection
          .find({ availability: "Available" })
          .toArray();
        res.json(cars);
      } catch (err) {
        console.error("Error fetching available cars:", err);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });
    // Send a ping to confirm a successful connection
    //  await client.db("admin").command({ ping: 1 });
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
