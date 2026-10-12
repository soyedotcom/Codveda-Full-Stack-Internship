import express from "express";
const app = express();
const PORT = process.env.PORT || 5000;

let cars = [
  { plate: "ABC123", brand: "Toyota", model: "Camry", year: 2018 },
  { plate: "DEF456", brand: "Honda", model: "Civic", year: 2019 },
  { plate: "GHI789", brand: "Ford", model: "Mustang", year: 2020 },
  { plate: "JKL012", brand: "BMW", model: "3 Series", year: 2015 },
  { plate: "MNO345", brand: "Porsche", model: "911", year: 2022 },
];

app.use(express.json());

//CRUD OPERATIONS

//create
app.post("/cars", (req, res) => {
  try {
    const { plate, brand, model, year } = req.body;
    if (!plate || !brand || !model || !year) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (year > new Date().getFullYear() || !Number.isInteger(year)) {
      return res.status(400).json({ message: "Year is invalid" });
    }
    if (cars.some((car) => car.plate === plate)) {
      return res
        .status(409)
        .json({ message: "Car with this plate already exists" });
    }

    const newCar = { plate, brand, model, year };
    cars.push(newCar);

    res.status(201).json(newCar);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//read all
app.get("/cars", (req, res) => {
  try {
    res.status(200).json(cars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//read one
app.get("/cars/:plate", (req, res) => {
  try {
    const plate = req.params.plate;
    const car = cars.find((car) => car.plate === plate);
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }
    res.status(200).json(car);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//update
app.put("/cars/:plate", (req, res) => {
  try {
    const plate = req.params.plate;
    const carIndex = cars.findIndex((car) => car.plate === plate);

    if (carIndex === -1) {
      return res.status(404).json({ message: "Car not found" });
    }

    const { brand, model, year } = req.body;
    if (!brand || !model || !year) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (year > new Date().getFullYear() || !Number.isInteger(year)) {
      return res.status(400).json({ message: "Year is invalid" });
    }

    cars[carIndex] = { ...cars[carIndex], brand, model, year };
    res.status(200).json(cars[carIndex]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//delete
app.delete("/cars/:plate", (req, res) => {
  try {
    const plate = req.params.plate;
    const carIndex = cars.findIndex((car) => car.plate === plate);

    if (carIndex === -1) {
      return res.status(404).json({ message: "Car not found" });
    }

    const car = cars.splice(carIndex, 1)[0];
    res.status(200).json({ message: "Car deleted successfully", car });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
