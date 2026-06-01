import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateSession } from "./app/lib/supabase-server";

export async function proxy(request: NextRequest) {
  const { response, user } = await updateSession(request);
  const isLoginPage = request.nextUrl.pathname.startsWith("/login");

  if (!user && !isLoginPage) {
    const redirect = NextResponse.redirect(new URL("/login", request.url));
    response.cookies
      .getAll()
      .forEach(({ name, value }) => redirect.cookies.set(name, value));

    return redirect;
  }

  if (user && isLoginPage) {
    const redirect = NextResponse.redirect(new URL("/", request.url));
    response.cookies
      .getAll()
      .forEach(({ name, value }) => redirect.cookies.set(name, value));

    return redirect;
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
