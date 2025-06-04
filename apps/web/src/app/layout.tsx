import { appWithTranslation } from 'next-i18next';
import '../styles/globals.css';

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

export default appWithTranslation(RootLayout);
