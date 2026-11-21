import "./globals.css";

export const metadata = {
   title: "DBK VMS | Vendor Management System",
   description:
      "Manage requirements, candidates, and background verification in one place.",
};

export default function RootLayout({ children }) {
   return (
      <html lang="en">
         <body className="antialiased">{children}</body>
      </html>
   );
}
