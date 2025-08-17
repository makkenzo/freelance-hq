import { initPocketBase } from '@/lib/pb';
import { type NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
    const pb = await initPocketBase(request);

    const isAuthenticated = pb.authStore.isValid;
    console.log(pb.authStore);

    const { pathname } = request.nextUrl;

    if (isAuthenticated && (pathname.startsWith('/login') || pathname.startsWith('/register'))) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Если пользователь НЕ залогинен и пытается зайти на защищенную страницу,
    // перенаправляем его на страницу входа.
    if (!isAuthenticated && pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

// Конфигурация: указываем, на каких маршрутах должен работать Middleware
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
