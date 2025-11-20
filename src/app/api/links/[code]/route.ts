import { NextResponse } from "next/server";
import { db } from "@/db/client";
import * as schema from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
    request: Request,
    ctx: { params: Promise<{ code: string }> }
) {
    const { code } = await ctx.params;

    const row = await db
        .select()
        .from(schema.links)
        .where(eq(schema.links.code, code));

    if (!row.length)
        return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json(row[0]);
}

export async function DELETE(
    request: Request,
    ctx: { params: Promise<{ code: string }> }
) {
    const { code } = await ctx.params;

    await db.delete(schema.links).where(eq(schema.links.code, code));

    return NextResponse.json({ ok: true });
}
