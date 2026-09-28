import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

const DATA_DIR = path.join(__dirname, 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const USER_FILE = path.join(DATA_DIR, 'user.json');

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Request logger middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
  });
  next();
});

// Helper: Read JSON file with fallback
async function readJsonFile(filePath, fallbackData = []) {
  try {
    const raw = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch (error) {
    if (error.code === 'ENOENT') {
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      await fs.writeFile(filePath, JSON.stringify(fallbackData, null, 2), 'utf-8');
      return fallbackData;
    }
    console.error(`Error reading ${filePath}:`, error.message);
    return fallbackData;
  }
}

// Helper: Write JSON file safely
async function writeJsonFile(filePath, data) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

// Default Seed Data
const DEFAULT_PRODUCTS = [
  {
    id: "prod-1",
    name: "MacBook Pro 16\" M3 Max",
    price: 3499.00,
    category: "Computing",
    stock: 14,
    rating: 4.9,
    description: "Apple M3 Max chip with 16-core CPU, 40-core GPU, and 48GB unified memory.",
    createdAt: "2026-09-01T10:00:00.000Z",
    updatedAt: "2026-09-20T14:30:00.000Z"
  },
  {
    id: "prod-2",
    name: "Sony WH-1000XM5 Headphones",
    price: 399.99,
    category: "Audio",
    stock: 28,
    rating: 4.8,
    description: "Industry-leading noise canceling with Auto NC Optimizer and 30-hour battery life.",
    createdAt: "2026-09-05T11:20:00.000Z",
    updatedAt: "2026-09-21T09:15:00.000Z"
  },
  {
    id: "prod-3",
    name: "Keychron Q1 Pro Mechanical Keyboard",
    price: 199.00,
    category: "Accessories",
    stock: 45,
    rating: 4.7,
    description: "Custom wireless mechanical keyboard with QMK/VIA support and CNC aluminum body.",
    createdAt: "2026-09-08T15:40:00.000Z",
    updatedAt: "2026-09-18T16:00:00.000Z"
  },
  {
    id: "prod-4",
    name: "LG UltraFine 27\" 4K Ergo Monitor",
    price: 449.50,
    category: "Computing",
    stock: 9,
    rating: 4.6,
    description: "IPS display with HDR10, USB-C 60W power delivery, and ultra-flexible ergonomic arm.",
    createdAt: "2026-09-10T08:30:00.000Z",
    updatedAt: "2026-09-22T12:00:00.000Z"
  },
  {
    id: "prod-5",
    name: "Apple Watch Ultra 2",
    price: 799.00,
    category: "Wearables",
    stock: 22,
    rating: 4.9,
    description: "Rugged 49mm titanium case, precision dual-frequency GPS, and 3000 nits display.",
    createdAt: "2026-09-12T14:10:00.000Z",
    updatedAt: "2026-09-23T11:45:00.000Z"
  },
  {
    id: "prod-6",
    name: "Logitech MX Master 3S Mouse",
    price: 99.99,
    category: "Accessories",
    stock: 53,
    rating: 4.9,
    description: "Quiet clicks and 8K DPI track-on-glass sensor with ultra-fast MagSpeed scrolling.",
    createdAt: "2026-09-15T09:00:00.000Z",
    updatedAt: "2026-09-24T18:20:00.000Z"
  }
];

// Health Check Endpoint
app.get(['/api/health', '/health'], (req, res) => {
  res.json({
    status: 'healthy',
    service: 'Production API',
    version: '1.0.0',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// User Profile Endpoints
app.get(['/api/user', '/api/profile', '/user', '/profile'], async (req, res, next) => {
  try {
    const user = await readJsonFile(USER_FILE, {
      id: "usr-101",
      name: "Zaid Khan",
      email: "zaid@enterprise.dev",
      role: "Inventory & Production Lead",
      department: "Engineering & Operations",
      status: "Online",
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=ZaidProduction",
      permissions: ["create:product", "edit:product", "delete:product", "view:analytics"],
      lastActive: "Just now"
    });
    res.json(user);
  } catch (err) {
    next(err);
  }
});

app.put(['/api/user', '/api/profile', '/user', '/profile'], async (req, res, next) => {
  try {
    const current = await readJsonFile(USER_FILE);
    const updated = {
      ...current,
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    await writeJsonFile(USER_FILE, updated);
    res.json({ success: true, message: 'Profile updated successfully', user: updated });
  } catch (err) {
    next(err);
  }
});

// Analytics & Stats Endpoint
app.get(['/api/stats', '/stats'], async (req, res, next) => {
  try {
    const products = await readJsonFile(PRODUCTS_FILE, DEFAULT_PRODUCTS);
    const totalProducts = products.length;
    const totalStock = products.reduce((acc, p) => acc + (Number(p.stock) || 0), 0);
    const totalInventoryValue = products.reduce((acc, p) => acc + ((Number(p.price) || 0) * (Number(p.stock) || 0)), 0);
    const averagePrice = totalProducts > 0 
      ? products.reduce((acc, p) => acc + (Number(p.price) || 0), 0) / totalProducts 
      : 0;

    const categories = {};
    products.forEach(p => {
      categories[p.category] = (categories[p.category] || 0) + 1;
    });

    const lowStockCount = products.filter(p => Number(p.stock) < 10).length;

    res.json({
      totalProducts,
      totalStock,
      totalInventoryValue: Number(totalInventoryValue.toFixed(2)),
      averagePrice: Number(averagePrice.toFixed(2)),
      categoriesCount: Object.keys(categories).length,
      categoryDistribution: categories,
      lowStockCount
    });
  } catch (err) {
    next(err);
  }
});

// Reset Products Endpoint (Utility)
app.post(['/api/products/reset', '/products/reset'], async (req, res, next) => {
  try {
    await writeJsonFile(PRODUCTS_FILE, DEFAULT_PRODUCTS);
    res.json({ success: true, message: 'Products reset to default inventory', products: DEFAULT_PRODUCTS });
  } catch (err) {
    next(err);
  }
});

// GET /api/products - List all products with search, filter, and sorting
app.get(['/api/products', '/products'], async (req, res, next) => {
  try {
    let products = await readJsonFile(PRODUCTS_FILE, DEFAULT_PRODUCTS);
    const { search, category, minPrice, maxPrice, sortBy, order } = req.query;

    // Filter by Search Query
    if (search && search.trim() !== '') {
      const q = search.trim().toLowerCase();
      products = products.filter(p => 
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q))
      );
    }

    // Filter by Category
    if (category && category !== 'All') {
      products = products.filter(p => 
        p.category && p.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Filter by Min / Max Price
    if (minPrice !== undefined && !isNaN(minPrice)) {
      products = products.filter(p => Number(p.price) >= Number(minPrice));
    }
    if (maxPrice !== undefined && !isNaN(maxPrice)) {
      products = products.filter(p => Number(p.price) <= Number(maxPrice));
    }

    // Sorting
    if (sortBy) {
      const sortOrder = order === 'desc' ? -1 : 1;
      products.sort((a, b) => {
        if (sortBy === 'price') {
          return (Number(a.price) - Number(b.price)) * sortOrder;
        }
        if (sortBy === 'stock') {
          return (Number(a.stock) - Number(b.stock)) * sortOrder;
        }
        if (sortBy === 'rating') {
          return (Number(a.rating || 0) - Number(b.rating || 0)) * sortOrder;
        }
        if (sortBy === 'createdAt') {
          return (new Date(a.createdAt || 0) - new Date(b.createdAt || 0)) * sortOrder;
        }
        // Default alphabetical
        return (a.name || '').localeCompare(b.name || '') * sortOrder;
      });
    }

    res.json(products);
  } catch (err) {
    next(err);
  }
});

// GET /api/products/:id - Single product
app.get(['/api/products/:id', '/products/:id'], async (req, res, next) => {
  try {
    const { id } = req.params;
    const products = await readJsonFile(PRODUCTS_FILE, DEFAULT_PRODUCTS);
    const product = products.find(p => String(p.id) === String(id));

    if (!product) {
      return res.status(404).json({
        success: false,
        error: `Product with id "${id}" not found`
      });
    }

    res.json(product);
  } catch (err) {
    next(err);
  }
});

// POST /api/products - Create new product
app.post(['/api/products', '/products'], async (req, res, next) => {
  try {
    const { name, price, category, stock, description, rating } = req.body;

    // Strict Validation
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Product "name" is required and must be a non-empty string'
      });
    }

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      return res.status(400).json({
        success: false,
        error: 'Product "price" is required and must be a non-negative number'
      });
    }

    if (!category || typeof category !== 'string' || category.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Product "category" is required'
      });
    }

    const parsedStock = stock !== undefined ? parseInt(stock, 10) : 10;
    if (isNaN(parsedStock) || parsedStock < 0) {
      return res.status(400).json({
        success: false,
        error: 'Product "stock" must be a non-negative integer'
      });
    }

    const products = await readJsonFile(PRODUCTS_FILE, DEFAULT_PRODUCTS);

    const now = new Date().toISOString();
    const newProduct = {
      id: `prod-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: name.trim(),
      price: Number(parsedPrice.toFixed(2)),
      category: category.trim(),
      stock: parsedStock,
      rating: rating ? Number(parseFloat(rating).toFixed(1)) : 5.0,
      description: description ? description.trim() : `High-quality ${category.trim()} device built for performance.`,
      createdAt: now,
      updatedAt: now
    };

    products.unshift(newProduct);
    await writeJsonFile(PRODUCTS_FILE, products);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product: newProduct
    });
  } catch (err) {
    next(err);
  }
});

// PUT /api/products/:id - Update existing product
app.put(['/api/products/:id', '/products/:id'], async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, price, category, stock, description, rating } = req.body;

    const products = await readJsonFile(PRODUCTS_FILE, DEFAULT_PRODUCTS);
    const index = products.findIndex(p => String(p.id) === String(id));

    if (index === -1) {
      return res.status(404).json({
        success: false,
        error: `Product with id "${id}" not found`
      });
    }

    const existing = products[index];

    // Validation for provided fields
    if (name !== undefined && (typeof name !== 'string' || name.trim().length === 0)) {
      return res.status(400).json({ success: false, error: 'Product "name" must be a non-empty string' });
    }

    if (price !== undefined) {
      const parsedPrice = parseFloat(price);
      if (isNaN(parsedPrice) || parsedPrice < 0) {
        return res.status(400).json({ success: false, error: 'Product "price" must be a non-negative number' });
      }
    }

    const updatedProduct = {
      ...existing,
      name: name !== undefined ? name.trim() : existing.name,
      price: price !== undefined ? Number(parseFloat(price).toFixed(2)) : existing.price,
      category: category !== undefined ? category.trim() : existing.category,
      stock: stock !== undefined ? parseInt(stock, 10) : existing.stock,
      description: description !== undefined ? description.trim() : existing.description,
      rating: rating !== undefined ? Number(parseFloat(rating).toFixed(1)) : existing.rating,
      updatedAt: new Date().toISOString()
    };

    products[index] = updatedProduct;
    await writeJsonFile(PRODUCTS_FILE, products);

    res.json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct
    });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/products/:id - Delete product
app.delete(['/api/products/:id', '/products/:id'], async (req, res, next) => {
  try {
    const { id } = req.params;
    const products = await readJsonFile(PRODUCTS_FILE, DEFAULT_PRODUCTS);
    const index = products.findIndex(p => String(p.id) === String(id));

    if (index === -1) {
      return res.status(404).json({
        success: false,
        error: `Product with id "${id}" not found`
      });
    }

    const deletedProduct = products.splice(index, 1)[0];
    await writeJsonFile(PRODUCTS_FILE, products);

    res.json({
      success: true,
      message: `Product "${deletedProduct.name}" deleted successfully`,
      product: deletedProduct
    });
  } catch (err) {
    next(err);
  }
});

// 404 Handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.originalUrl} not found`,
    availableEndpoints: [
      'GET /api/health',
      'GET /api/user',
      'PUT /api/user',
      'GET /api/stats',
      'GET /api/products',
      'GET /api/products/:id',
      'POST /api/products',
      'PUT /api/products/:id',
      'DELETE /api/products/:id',
      'POST /api/products/reset'
    ]
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: err.message || 'An unexpected error occurred'
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🚀 Production REST API Server running on port ${PORT}`);
  console.log(`📍 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`📦 Products API: http://localhost:${PORT}/api/products`);
  console.log(`📊 Stats API:    http://localhost:${PORT}/api/stats`);
  console.log(`👤 User API:     http://localhost:${PORT}/api/user`);
  console.log(`===============================================`);
});

export default app;
