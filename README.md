# MediaGrid 🚀

MediaGrid is an AI-powered media optimization SaaS platform. It enables users to upload, compress, and transform videos and images for various social media platforms with ease.

## ✨ Features

- **AI Video Compression**: Intelligent compression that reduces file sizes while maintaining visual quality.
- **Social Media Share**: Instant cropping and transformations for Instagram (Square/Portrait), TikTok, Twitter, and LinkedIn.
- **Interactive Library**: A polished dashboard to manage and preview your optimized assets.
- **Premium UI**: Modern dark-mode interface utilizing glassmorphism, smooth animations, and responsive design.
- **Secure Authentication**: User management and protected routes powered by Clerk.
- **Relational Storage**: Asset metadata and user relationships managed via Prisma and PostgreSQL.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) & [DaisyUI](https://daisyui.com/)
- **Media Engine**: [Cloudinary AI](https://cloudinary.com/) & [Next Cloudinary](https://next.cloudinary.dev/)
- **Authentication**: [Clerk](https://clerk.com/)
- **Database**: [Prisma](https://www.prisma.io/) with PostgreSQL (Neon)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd mediagrid
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up Environment Variables
Create a `.env` file in the root directory and add your credentials:

```env
DATABASE_URL="your_postgresql_url"

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_pub_key"
CLERK_SECRET_KEY="your_clerk_secret_key"
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/home
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/home
```

### 4. Database Setup
Sync the Prisma schema with your database:
```bash
npx prisma generate
npx prisma db push
```

### 5. Run the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📁 Project Structure

- `/app`: Next.js App Router (Pages, API routes, and Layouts).
- `/components`: Reusable UI components (VideoCard, etc.).
- `/lib`: Shared utilities (Prisma client, etc.).
- `/prisma`: Database schema and configuration.
- `/types`: Shared TypeScript interfaces.
- `/public`: Static assets.
