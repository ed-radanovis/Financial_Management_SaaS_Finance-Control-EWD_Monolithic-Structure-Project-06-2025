import { NextResponse } from "next/server";

export async function GET(req: Request) {
	const { searchParams } = new URL(req.url);
	const name = searchParams.get("name") || "Usuário";
	return NextResponse.json(
		{ message: `Teste Rota OK, ${name}!` },
		{ status: 200 },
	);
}

export const dynamic = "force-dynamic"; // Força como rota dinâmica
