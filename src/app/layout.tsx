// src/app/layout.tsx

import "../styles/globals.css";

export const metadata = {
    title: "TinyLink",
    description: "Fast URL Shortener",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
