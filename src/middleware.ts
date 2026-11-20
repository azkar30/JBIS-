import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Menyegarkan session Supabase & melindungi halaman yang butuh login / admin
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const path = request.nextUrl.pathname;
  const redirectTo = (to: string) => {
    const url = request.nextUrl.clone();
    url.pathname = to;
    url.search = to === "/admin/login" || to === "/masuk" ? `?next=${encodeURIComponent(path)}` : "";
    return NextResponse.redirect(url);
  };

  // Halaman customer yang wajib login
  if ((path.startsWith("/jual") || path.startsWith("/akun")) && !user) {
    return redirectTo("/masuk");
  }

  // Semua halaman admin (kecuali halaman login admin) wajib role admin
  if (path.startsWith("/admin") && path !== "/admin/login") {
    if (!user) return redirectTo("/admin/login");
    const { data } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (data?.role !== "admin") return redirectTo("/admin/login");
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|webp)$).*)"],
};
