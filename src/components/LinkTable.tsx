"use client";
import Link from "next/link";

export default function LinkTable({
    links = [],
    baseUrl = "http://localhost:3000",
    onDelete = (c: string) => { },
}: any) {
    const copyText = async (t: string) => {
        if (navigator.clipboard) {
            await navigator.clipboard.writeText(t);
            alert("Copied");
        }
    };

    return (
        <div className="overflow-x-auto bg-white rounded shadow">
            <table className="min-w-full">
                <thead className="bg-gray-100 text-left text-xs uppercase tracking-wider">
                    <tr>
                        <th className="px-3 py-2">Short</th>
                        <th className="px-3 py-2">Target URL</th>
                        <th className="px-3 py-2">Clicks</th>
                        <th className="px-3 py-2">Last clicked</th>
                        <th className="px-3 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {links.length === 0 && (
                        <tr>
                            <td colSpan={5} className="p-4 text-center text-gray-500">
                                No records
                            </td>
                        </tr>
                    )}
                    {links.map((link: any) => (
                        <tr key={link.code} className="border-t">
                            <td className="px-3 py-2">
                                <a
                                    className="text-blue-600 hover:underline"
                                    href={`${baseUrl}/${link.code}`}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    {baseUrl}/{link.code}
                                </a>
                            </td>

                            <td className="px-3 py-2 max-w-lg">
                                <div className="truncate max-w-2xl">{link.url}</div>
                            </td>

                            <td className="px-3 py-2">{link.clicks}</td>
                            <td className="px-3 py-2">
                                {link.lastClicked
                                    ? new Date(link.lastClicked).toLocaleString()
                                    : "-"}
                            </td>

                            <td className="px-3 py-2">
                                <div className="flex gap-4">
                                    <button className="px-2 py-1 border rounded text-sm" onClick={() => copyText(`${baseUrl}/${link.code}`)}>Copy</button>

                                    {/* <Link
                                        href={`/code/${link.code}`}
                                        className="px-2 py-1 border rounded text-sm"
                                    >
                                        Stats
                                    </Link> */}

                                    <button className="px-2 py-1 bg-red-600 text-white rounded text-sm" onClick={() => onDelete(link.code)}>Delete</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
