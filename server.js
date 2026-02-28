import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 5000;

// Enable CORS
app.use(cors());
app.use(express.json());

// Ensure public/uploads exists
const uploadDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Serve static files from public
app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

// Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// API endpoint for file upload
app.post('/api/upload', upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        const filePath = `http://localhost:${port}/uploads/${req.file.filename}`;
        res.json({ filePath });
    } catch (error) {
        console.error('Upload route error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Read db.json
const dbPath = path.join(__dirname, 'db.json');
let db = {};

function loadDb() {
    try {
        const data = fs.readFileSync(dbPath, 'utf8');
        db = JSON.parse(data);
        console.log('✓ db.json loaded successfully');
        console.log('  - Users:', db.users?.length || 0);
        console.log('  - Courses:', db.courses?.length || 0);
    } catch (error) {
        console.error('Error loading db.json:', error.message);
        db = { users: [], courses: [] };
    }
}

// Load db on startup
loadDb();

// Middleware to reload DB for every request to ensure manual edits are picked up
app.use((req, res, next) => {
    if (req.method === 'GET' || req.path.includes('/users') || req.path.includes('/courses')) {
        loadDb();
    }
    next();
});

// API Routes
app.get('/users', (req, res) => {
    console.log('GET /users - Query params:', req.query);

    let users = db.users || [];

    // Filter by query parameters if provided
    if (req.query.email && req.query.password) {
        console.log(`Filtering by email: ${req.query.email} and password: ${req.query.password}`);
        users = users.filter(u => u.email === req.query.email && u.password === req.query.password);
    } else if (req.query.email) {
        console.log(`Filtering by email: ${req.query.email}`);
        users = users.filter(u => u.email === req.query.email);
    } else if (req.query.password) {
        console.log(`Filtering by password: ${req.query.password}`);
        users = users.filter(u => u.password === req.query.password);
    } else if (req.query.role) {
        console.log(`Filtering by role: ${req.query.role}`);
        users = users.filter(u => u.role === req.query.role);
    }

    console.log(`Returning ${users.length} user(s)`);
    res.json(users);
});

app.get('/courses', (req, res) => {
    let courses = db.courses || [];

    // Filter by instructorId if provided
    if (req.query.instructorId) {
        console.log('Filtering courses by instructorId:', req.query.instructorId);
        courses = courses.filter(c => c.instructorId === req.query.instructorId);
    }

    console.log(`Returning ${courses.length} course(s)`);
    res.json(courses);
});

app.get('/users/:id', (req, res) => {
    console.log('GET /users/:id - Looking for ID:', req.params.id);
    const user = (db.users || []).find(u => u.id === req.params.id);
    console.log('Found user:', user);
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ error: 'User not found' });
    }
});

app.get('/courses/:id', (req, res) => {
    const course = (db.courses || []).find(c => c.id === parseInt(req.params.id));
    if (course) {
        res.json(course);
    } else {
        res.status(404).json({ error: 'Course not found' });
    }
});

app.post('/courses', (req, res) => {
    const newCourse = {
        ...req.body,
        id: Math.max(...(db.courses || []).map(c => c.id || 0), 0) + 1,
        createdAt: new Date().toISOString()
    };
    if (!db.courses) db.courses = [];
    db.courses.push(newCourse);
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
    res.status(201).json(newCourse);
});

app.post('/users', (req, res) => {
    const newUser = {
        ...req.body,
        id: String(Math.max(...(db.users || []).map(u => parseInt(u.id) || 0), 0) + 1)
    };
    if (!db.users) db.users = [];
    db.users.push(newUser);
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
    res.status(201).json(newUser);
});

// DELETE course
app.delete('/courses/:id', (req, res) => {
    try {
        const courseId = parseInt(req.params.id);
        console.log('DELETE /courses/:id - Deleting course ID:', courseId);
        console.log('Available courses:', (db.courses || []).map(c => ({ id: c.id, title: c.title })));

        const courseIndex = (db.courses || []).findIndex(c => c.id === courseId);
        console.log('Course index found:', courseIndex);

        if (courseIndex === -1) {
            console.log('Course not found');
            return res.status(404).json({ error: 'Course not found' });
        }

        const deletedCourse = db.courses.splice(courseIndex, 1)[0];
        fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

        console.log('Course deleted:', deletedCourse.title);
        res.status(200).json({ message: 'Course deleted successfully', course: deletedCourse });
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ error: error.message });
    }
});

// UPDATE course
app.put('/courses/:id', (req, res) => {
    const courseId = parseInt(req.params.id);
    console.log('PUT /courses/:id - Updating course ID:', courseId);

    const courseIndex = (db.courses || []).findIndex(c => c.id === courseId);

    if (courseIndex === -1) {
        return res.status(404).json({ error: 'Course not found' });
    }

    db.courses[courseIndex] = { ...db.courses[courseIndex], ...req.body };
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

    res.json(db.courses[courseIndex]);
});

// UPDATE user (PUT)
app.put('/users/:id', (req, res) => {
    console.log('PUT /users/:id - Updating user ID:', req.params.id);

    const userIndex = (db.users || []).findIndex(u => u.id === req.params.id);

    if (userIndex === -1) {
        return res.status(404).json({ error: 'User not found' });
    }

    db.users[userIndex] = { ...db.users[userIndex], ...req.body };
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

    res.json(db.users[userIndex]);
});

// UPDATE user (PATCH)
app.patch('/users/:id', (req, res) => {
    console.log('PATCH /users/:id - Updating user ID:', req.params.id);

    const userIndex = (db.users || []).findIndex(u => u.id === req.params.id);

    if (userIndex === -1) {
        return res.status(404).json({ error: 'User not found' });
    }

    db.users[userIndex] = { ...db.users[userIndex], ...req.body };
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

    res.json(db.users[userIndex]);
});

// UPDATE course (PATCH)
app.patch('/courses/:id', (req, res) => {
    const courseId = parseInt(req.params.id);
    console.log('PATCH /courses/:id - Updating course ID:', courseId);

    const courseIndex = (db.courses || []).findIndex(c => c.id === courseId);

    if (courseIndex === -1) {
        return res.status(404).json({ error: 'Course not found' });
    }

    db.courses[courseIndex] = { ...db.courses[courseIndex], ...req.body };
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

    res.json(db.courses[courseIndex]);
});

// GET purchases
app.get('/purchases', (req, res) => {
    let purchases = db.purchases || [];
    if (req.query.userId) {
        purchases = purchases.filter(p => p.userId === req.query.userId);
    }
    res.json(purchases);
});

// POST purchases
app.post('/purchases', (req, res) => {
    const newPurchase = {
        ...req.body,
        id: `p${Date.now()}` // Simple ID generation
    };
    if (!db.purchases) db.purchases = [];
    db.purchases.push(newPurchase);
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
    res.status(201).json(newPurchase);
});

app.listen(port, () => {
    console.log(`\n🚀 Server is running on http://localhost:${port}`);
    console.log(`📚 Courses endpoint: http://localhost:${port}/courses`);
    console.log(`👥 Users endpoint: http://localhost:${port}/users\n`);
});
