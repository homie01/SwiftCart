# SwiftCart Frontend

React frontend for the existing SwiftCart backend.

## Run

1. Install dependencies:

```bash
npm install
```

2. Start the frontend:

```bash
npm run dev
```

3. Set API URL if needed in `.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## Backend endpoints used

- `GET /api/products`
- `GET /api/products/:id`
- `GET /api/categories`
- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/carts/:id`
- `POST /api/carts/:id`
- `DELETE /api/carts/:productId/:userId`
