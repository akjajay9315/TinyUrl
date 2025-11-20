"use client";

import { useEffect, useState } from "react";
import LinkTable from "@/components/LinkTable";

const BASE = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export default function Page() {
    const [links, setLinks] = useState<any[]>([]);
    const [url, setUrl] = useState("");
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function fetchLinks() {
        setLoading(true);
        const res = await fetch("/api/links");
        const data = await res.json();
        setLinks(data);
        setLoading(false);
    }

    useEffect(() => { fetchLinks(); }, []);

    async function handleCreate(e: any) {
        e?.preventDefault();
        setError(null);
        setCreating(true);
        try {
            const res = await fetch("/api/links", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url, code: code || undefined }),
            });
            const d = await res.json();
            if (!res.ok) {
                setError(d.error || "Failed");
            } else {
                setUrl(""); setCode(""); await fetchLinks(); alert("Created");
            }
        } catch (err) {
            setError("Network error");
        } finally { setCreating(false); }
    }

    async function handleDelete(c: string) {
        if (!confirm("Delete link?")) return;
        await fetch(`/api/links/${c}`, { method: "DELETE" });
        await fetchLinks();
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold mb-4">TinyLink Dashboard</h1>

            <form className="bg-white p-4 rounded shadow mb-6" onSubmit={handleCreate}>
                <div className="grid md:grid-cols-3 gap-3">
                    <input className="col-span-2 border p-2 rounded" placeholder="https://example.com/path" value={url} onChange={e => setUrl(e.target.value)} required />
                    <input className="border p-2 rounded" placeholder="Custom code (optional, 6-8 alnum)" value={code} onChange={e => setCode(e.target.value)} />
                </div>
                <div className="mt-3 flex items-center gap-3">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded" disabled={creating}>{creating ? "Creating..." : "Create"}</button>
                    {error && <div className="text-red-600">{error}</div>}
                    <div className="text-sm text-gray-500 ml-auto">Short URL base: <span className="font-mono">{BASE}/&lt;code&gt;</span></div>
                </div>
            </form>

            {loading ? <div className="text-gray-500">Loading...</div> : <LinkTable links={links} onDelete={handleDelete} baseUrl={BASE} />}
        </div>
    );
}
