'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

interface NavbarProps {
  hideSignUp?: boolean;
}

export default function Navbar({ hideSignUp = false }: NavbarProps) {
  const _router = useRouter();
  const { data: session } = useSession();

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: '/' });
  };

  return (
    <nav className="bg-gradient-to-r from-purple-800 to-purple-900 shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold text-blue-400 hover:text-blue-300">
            MGTECH
          </Link>
          
          <div className="flex items-center space-x-4">
            {session?.user ? (
              <div className="flex items-center space-x-4">
                <span className="text-white">
                  {session.user.name}님 환영합니다
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                >
                  로그아웃
                </button>
              </div>
            ) : (
              <Link 
                href="/apply" 
                className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors font-semibold"
              >
                접수하기
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 