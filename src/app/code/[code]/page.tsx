import { db } from "@/db/client";
import { links } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function StatsPage({ params }: { params: { code: string } }) {
    const code = params.code;

    const rows = await db.select().from(links).where(eq(links.code, code));

    if (rows.length === 0) {
        return <div className="p-6">Not found</div>;
    }

    const link = rows[0];

    return (
        <div className="p-6 max-w-3xl mx-auto bg-white rounded shadow">
            <h1 className="text-2xl font-semibold mb-4">Stats — {code}</h1>

            <div className="space-y-2 text-sm text-gray-700">
                <div>
                    <strong>Target URL:</strong>{" "}
                    <a
                        href={link.url}
                        className="text-blue-600"
                        target="_blank"
                        rel="noreferrer"
                    >
                        {link.url}
                    </a>
                </div>

                <div>
                    <strong>Short:</strong>{" "}
                    <span className="font-mono">
                        {process.env.NEXT_PUBLIC_BASE_URL}/{link.code}
                    </span>
                </div>

                <div>
                    <strong>Clicks:</strong> {link.clicks ?? 0}
                </div>

                <div>
                    <strong>Created at:</strong>{" "}
                    {link.createdAt ? new Date(link.createdAt).toLocaleString() : "-"}
                </div>

                <div>
                    <strong>Last clicked:</strong>{" "}
                    {link.lastClicked ? new Date(link.lastClicked).toLocaleString() : "-"}
                </div>
            </div>
        </div>
    );
}
