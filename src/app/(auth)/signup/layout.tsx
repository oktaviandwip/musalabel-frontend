import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Musalabel',
  description: 'Jual baju wanita muslim berkualitas di Jakarta Timur',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className='font-apercu'>
        {children}
      </body>
    </html>
  )
}