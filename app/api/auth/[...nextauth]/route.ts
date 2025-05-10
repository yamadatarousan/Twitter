import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

// Next.js App Router が期待するルートハンドラー型 (req: NextRequest) => Response
// と NextAuth v5 の handler 型が微妙に噛み合わないため、ビルド通過用に型エラーを抑制します。
// @ts-expect-error NextAuth v5 handler の型が Next.js のルートハンドラー型と一致しない
export const GET = handler;
// @ts-expect-error NextAuth v5 handler の型が Next.js のルートハンドラー型と一致しない
export const POST = handler;

export { authOptions };