export async function GET() {
    return new Response(JSON.stringify({ ok: true, version: "1.0" }), {
        headers: { "Content-Type": "application/json" },
        status: 200,
    });
}
