import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Middleware body cleared because Appwrite Cloud cookies are not reliably 
    // accessible on the server-side during local development (localhost).
    // Authentication protection is now handled client-side in /(admin)/layout.tsx
    return NextResponse.next();
}

export const config = {
    matcher: ['/sekre/:path*'],
};
