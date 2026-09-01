import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '../context/AuthContext';

export const metadata: Metadata = {
  title: 'FaunaPulse - Animal Feedback & Ratings',
  description: 'Full-stack Animal Feedback Webapp built with TypeScript, Next.js, Express.js, MongoDB Atlas, and Cloudinary.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
