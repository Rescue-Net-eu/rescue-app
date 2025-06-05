import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#1d4ed8" />
        <link rel="icon" href="/icon-192.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
