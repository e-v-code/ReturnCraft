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
            ReturnCraft
          </Link>
          
          <div className="flex items-center space-x-4">
            {session?.user ? (
              // 로그인 상태
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
              // 비로그인 상태
              <div className="flex items-center space-x-4">
                {!hideSignUp && (
                  <Link href="/signup" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
                    회원가입
                  </Link>
                )}
                <Link href="/signin" className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition-colors">
                  로그인
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 