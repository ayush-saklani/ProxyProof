import Header from '@/components/Header';
import '../index.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Header />
      <body>{children}</body>
    </html>
  );
}
