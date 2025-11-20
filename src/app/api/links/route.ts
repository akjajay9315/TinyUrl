import { NextResponse } from "next/server";
import { db } from "@/db/client";
import * as schema from "@/db/schema";
import { customAlphabet } from "nanoid";
import { desc, eq } from "drizzle-orm";

const ALPHA = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const nano = customAlphabet(ALPHA, 6);
const CODE_REGEX = /^[A-Za-z0-9]{6,8}$/;

function validUrl(u: string) {
    try {
        const url = new URL(u);
        return url.protocol === "http:" || url.protocol === "https:";
    } catch {
        return false;
    }
}

export async function GET() {
    const rows = await db
        .select()
        .from(schema.links)
        .orderBy(desc(schema.links.createdAt));

    return NextResponse.json(rows);
}

export async function POST(req: Request) {
    const body = await req.json().catch(() => ({}));
    const url = body?.url;
    let code = body?.code;

    if (!url || !validUrl(url)) {
        return NextResponse.json(
            { error: "Invalid url. Include http/https." },
            { status: 400 }
        );
    }

    // ----- If user provided custom code -----
    if (code) {
        if (!CODE_REGEX.test(code)) {
            return NextResponse.json(
                { error: "Invalid code. Must match [A-Za-z0-9]{6,8}." },
                { status: 400 }
            );
        }

        const existing = await db
            .select()
            .from(schema.links)
            .where(eq(schema.links.code, code));

        if (existing.length) {
            return NextResponse.json(
                { error: "Code already exists" },
                { status: 409 }
            );
        }
    }

    // ----- Auto-generate code if missing -----
    else {
        for (let i = 0; i < 5; i++) {
            const candidate = nano();
            const exists = await db
                .select()
                .from(schema.links)
                .where(eq(schema.links.code, candidate));

            if (!exists.length) {
                code = candidate;
                break;
            }
        }

        if (!code) {
            return NextResponse.json(
                { error: "Unable to generate code" },
                { status: 500 }
            );
        }
    }

    // Save link
    await db.insert(schema.links).values({ code, url });

    return NextResponse.json({ code, url }, { status: 201 });
}
