import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { createProxyMiddleware } from 'http-proxy-middleware';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  
  // Proxy configuration
  const target = process.env.VITE_API_BASE_URL || 'https://noncontroversial-endemically-kareen.ngrok-free.dev/';
  if (target) {
    console.log(`Proxying /v1 and /api to ${target}`);
    const apiProxy = createProxyMiddleware({
      target,
      changeOrigin: true,
      pathFilter: ['/v1', '/api'],
      on: {
        proxyReq: (proxyReq, req, res) => {
          proxyReq.setHeader('ngrok-skip-browser-warning', 'true');
        },
        error: (err, req, res) => {
          console.error('Proxy Error:', err);
        }
      }
    });
    app.use(apiProxy);
  }

  app.use(express.json());

  // Request logger
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
  });

  // Mock API Routes
  app.post('/api/token', (req, res) => {
    const { username, password } = req.body;
    // Mock login logic
    if (username === 'admin' && password === 'admin123') {
      return res.json({
        access_token: 'mock-admin-token',
        token_type: 'bearer',
        role: 'admin'
      });
    } else if (username === 'educator' && password === 'educator123') {
      return res.json({
        access_token: 'mock-educator-token',
        token_type: 'bearer',
        role: 'educator'
      });
    } else if (username === 'student' && password === 'student123') {
      return res.json({
        access_token: 'mock-student-token',
        token_type: 'bearer',
        role: 'student'
      });
    }
    res.status(401).json({ message: 'Invalid credentials' });
  });

  // Mock V1 Routes
  const mockProfile = {
    id: 1,
    fullName: 'Mock User',
    fullname: 'Mock User',
    email: 'mock@example.com',
    phone: '123456789',
    birthday: '1990-01-01T00:00:00.000Z',
    avatarPath: 'https://picsum.photos/seed/user/200',
    username: 'mockuser',
    account: {
      id: 1,
      email: 'mock@example.com',
      fullName: 'Mock User',
      status: 'ACTIVE'
    }
  };

  app.get('/v1/account/profile', (req, res) => res.json(mockProfile));
  app.get('/v1/student/profile', (req, res) => res.json(mockProfile));
  app.get('/v1/educator/profile', (req, res) => res.json(mockProfile));

  app.post('/v1/student/signup', (req, res) => res.json({ message: 'Signup successful' }));
  app.post('/v1/educator/signup', (req, res) => res.json({ message: 'Signup successful' }));

  app.get('/v1/account/list', (req, res) => {
    res.json({
      data: {
        content: [
          { id: 1, fullName: 'Admin One', email: 'admin1@example.com', status: 1 },
          { id: 2, fullName: 'Admin Two', email: 'admin2@example.com', status: 1 },
        ],
        totalElements: 2,
        totalPages: 1,
        size: 10,
        number: 0
      }
    });
  });

  app.get('/v1/educator/list', (req, res) => {
    res.json({
      data: {
        content: [
          { id: 1, account: { fullName: 'Educator One', email: 'edu1@example.com', status: 1 } },
          { id: 2, account: { fullName: 'Educator Two', email: 'edu2@example.com', status: 1 } },
        ],
        totalElements: 2,
        totalPages: 1,
        size: 10,
        number: 0
      }
    });
  });

  app.get('/v1/student/list', (req, res) => {
    res.json({
      data: {
        content: [
          { id: 1, account: { fullName: 'Student One', email: 'stu1@example.com', status: 1 } },
          { id: 2, account: { fullName: 'Student Two', email: 'stu2@example.com', status: 1 } },
        ],
        totalElements: 2,
        totalPages: 1,
        size: 10,
        number: 0
      }
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
