import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config.js";
import User from "./User.js";
import Product from "./Products.js";

// Load environment variables
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "https://rakeshcrud-operation.onrender.com", // Production frontend URL
    ],
    credentials: true,
  })
);

// Database Connection
connectDB().catch((err) => {
  console.error("Database connection failed:", err.message);
  process.exit(1);
});

// Auth Middleware
const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }
  try {
    const decoded = jwt.verify(token, process.env.KEY);
    req.user = decoded; // Attach user info to the request object
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

// Sign Up Route
app.post("/auth/signup", async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    // Validate passwords
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    // Respond with success
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Signup error:", error); // Log error
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

// Login Route
app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.KEY, { expiresIn: "2h" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 2 hours
      sameSite: "None", // Cross-origin cookie
      domain: "ecomcrud-dashboard.onrender.com",    
    });
    res.json({ message: "Login successful" });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Logout Route
app.post("/auth/logout", (req, res) => {
  res.clearCookie("token", { httpOnly: true, secure: process.env.NODE_ENV === "production" });
  res.json({ message: "Logged out successfully" });
});

// Authentication Check Route
app.get("/auth/check", (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.json({ isAuthenticated: false });
  }

  try {
    jwt.verify(token, process.env.KEY);
    return res.json({ isAuthenticated: true });
  } catch {
    return res.json({ isAuthenticated: false });
  }
});

// Get User Info Route
app.get("/user", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ username: user.username });
  } catch (error) {
    console.error("Error fetching user info:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get Products Route
app.get("/products", authMiddleware, async (req, res) => {
  try {
    const products = await Product.find({ userId: req.user.id });
    res.json(products);
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Add Product Route
app.post("/products", authMiddleware, async (req, res) => {
  try {
    const { name, price, category, company } = req.body;

    // Validate input fields
    if (!name || !price || !category || !company) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const product = new Product({
      name,
      price,
      category,
      company,
      userId: req.user.id, // Attach the user ID to the product
    });
    await product.save();

    res.status(201).json({ message: "Product added successfully" });
  } catch (error) {
    console.error("Add product error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get Product by ID Route
app.get("/products/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid product ID" });
  }

  try {
    const product = await Product.findOne({ _id: id, userId: req.user.id });
    if (!product) {
      return res.status(404).json({ message: "Product not found or not authorized" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Update Product Route
app.put("/products/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { name, price, category, company } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid product ID" });
  }

  try {
    // Validate input
    if (!name || !price || !category || !company) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Find the product by ID and ensure the user is authorized
    const product = await Product.findOne({ _id: id, userId: req.user.id });
    if (!product) {
      return res.status(404).json({ message: "Product not found or not authorized" });
    }

    // Update product fields
    product.name = name;
    product.price = price;
    product.category = category;
    product.company = company;

    // Save updated product to database
    await product.save();
    res.status(200).json({ message: "Product updated successfully", updatedProduct: product });
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Delete Product Route
app.delete("/products/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findOneAndDelete({ _id: id, userId: req.user.id });
    if (!product) {
      return res.status(404).json({ message: "Product not found or not authorized" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Search Products Route
app.get("/search/:key", authMiddleware, async (req, res) => {
  const key = req.params.key.trim(); // Ensure no trailing spaces
  if (!key) {
    return res.status(400).json({ success: false, message: "Search key is required" });
  }

  try {
    const products = await Product.find({
      userId: req.user.id, // Ensure user-specific search
      $or: [
        { name: { $regex: key, $options: "i" } },
        { category: { $regex: key, $options: "i" } },
        { company: { $regex: key, $options: "i" } },
      ],
    });

    // Handle no results found
    if (!products || products.length === 0) {
      return res.status(200).json({ success: true, message: "No products found", data: [] });
    }

    // Respond with the found products
    res.status(200).json({ success: true, message: "Products fetched successfully", data: products });
  } catch (error) {
    console.error("Search products error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
// import express from "express";
// import mongoose from "mongoose";
// import bcrypt from "bcryptjs";
// import cookieParser from "cookie-parser";
// import cors from "cors";
// import dotenv from "dotenv";
// import connectDB from "./config.js";
// import User from "./User.js";
// import Product from "./Products.js";

// // Load environment variables
// dotenv.config();
// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(express.json());
// app.use(cookieParser());
// app.use(
//   cors({
//     origin: [
//       "https://rakeshcrud-operation.onrender.com", // Production frontend URL
//     ],
//     credentials: true,
//   })
// );

// // Database Connection
// connectDB().catch((err) => {
//   console.error("Database connection failed:", err.message);
//   process.exit(1);
// });

// // Sign Up Route
// app.post("/auth/signup", async (req, res) => {
//   try {
//     const { username, email, password, confirmPassword } = req.body;

//     // Validate passwords
//     if (password !== confirmPassword) {
//       return res.status(400).json({ message: "Passwords do not match" });
//     }

//     // Check if email already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "Email already exists" });
//     }

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create new user
//     const newUser = new User({ username, email, password: hashedPassword });
//     await newUser.save();

//     // Respond with success
//     res.status(201).json({ message: "User registered successfully" });
//   } catch (error) {
//     console.error("Signup error:", error);
//     res.status(500).json({ message: "Internal Server Error", error: error.message });
//   }
// });

// // Login Route (No JWT)
// app.post("/auth/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: "User not found" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     res.json({ message: "Login successful" });
//   } catch (error) {
//     console.error("Login error:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// });

// // Logout Route (No JWT)
// app.post("/auth/logout", (req, res) => {
//   res.json({ message: "Logged out successfully" });
// });

// // Authentication Check Route (No JWT)
// app.get("/auth/check", (req, res) => {
//   res.json({ isAuthenticated: true }); // Always returning true for simplicity
// });

// // Get User Info Route (server.js)
// app.get('/user', async (req, res) => {
//   try {
//     // Fetch user ID from session or token
//     const userId = req.session.userId; // Example using session
//     if (!userId) return res.status(401).json({ message: 'Unauthorized' });

//     const user = await User.findById(userId);
//     if (!user) return res.status(404).json({ message: 'User not found' });

//     res.json({ userId: user._id, username: user.username });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // Get Products Route
// app.get("/products", async (req, res) => {
//   try {
//     const products = await Product.find();
//     res.json(products);
//   } catch (error) {
//     console.error("Get products error:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// });

// // Add Product Route
// app.post("/products", async (req, res) => {
//   try {
//     const { name, price, category, company } = req.body;

//     // Validate input fields
//     if (!name || !price || !category || !company) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     const product = new Product({
//       name,
//       price,
//       category,
//       company,
//       userId: req.user.id,
//     });
//     await product.save();

//     res.status(201).json({ message: "Product added successfully" });
//   } catch (error) {
//     console.error("Add product error:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// });

// // Get Product by ID Route
// app.get("/products/:id", async (req, res) => {
//   const { id } = req.params;

//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     return res.status(400).json({ message: "Invalid product ID" });
//   }

//   try {
//     const product = await Product.findById(id);
//     if (!product) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     res.status(200).json(product);
//   } catch (error) {
//     console.error("Error fetching product by ID:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// });

// // Update Product Route
// app.put("/products/:id", async (req, res) => {
//   const { id } = req.params;
//   const { name, price, category, company } = req.body;

//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     return res.status(400).json({ message: "Invalid product ID" });
//   }

//   try {
//     if (!name || !price || !category || !company) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     const product = await Product.findById(id);
//     if (!product) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     product.name = name;
//     product.price = price;
//     product.category = category;
//     product.company = company;

//     await product.save();
//     res.status(200).json({ message: "Product updated successfully", updatedProduct: product });
//   } catch (error) {
//     console.error("Update product error:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// });

// // Delete Product Route
// app.delete("/products/:id", async (req, res) => {
//   const { id } = req.params;

//   try {
//     const product = await Product.findByIdAndDelete(id);
//     if (!product) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     res.status(200).json({ message: "Product deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting product:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// });

// // Search Products Route
// app.get("/search/:key", async (req, res) => {
//   const key = req.params.key.trim(); // Ensure no trailing spaces
//   if (!key) {
//     return res.status(400).json({ success: false, message: "Search key is required" });
//   }

//   try {
//     const products = await Product.find({
//       $or: [
//         { name: { $regex: key, $options: "i" } },
//         { category: { $regex: key, $options: "i" } },
//         { company: { $regex: key, $options: "i" } },
//       ],
//     });

//     if (!products || products.length === 0) {
//       return res.status(200).json({ success: true, message: "No products found", data: [] });
//     }

//     res.status(200).json({ success: true, message: "Products fetched successfully", data: products });
//   } catch (error) {
//     console.error("Search products error:", error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// });

// // Start Server
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
