import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import Provider from './provider'

export const metadata = {
  title: "Interior AI",
  description: "AI-powered interior design app",
  manifest: "/manifest.json",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClerkProvider>
          <Provider>
            {children}
          </Provider>
        </ClerkProvider>
      </body>
    </html>
  )
}