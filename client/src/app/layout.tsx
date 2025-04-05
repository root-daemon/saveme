import '@rainbow-me/rainbowkit/styles.css';
import '../styles/globals.css';
import { Providers } from './providers';

export const metadata = {
  title: 'SaveMe',
  description: 'Save your funds from rug-pulls',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link href="/favicon.ico" rel="icon" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
