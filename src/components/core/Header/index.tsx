'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from '@/lib/auth/authUtils';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { ThemeSettings } from '@/components/core/ThemeSettings';
import { useState, useEffect, useRef } from 'react';
import { Clock } from './Clock';
import { useThemeStore } from '@/store/useThemeStore';

const navigation = [
  { name: '룬 도감', href: '/runes' },
  { name: '코디 도감', href: '/outfits' },
  { name: '생활계산기', href: '/calculator' },
  { name: '정보 공유', href: '/guide' },
];

export const Header = () => {
  const { user, loading } = useAuth();
  const { setIsDark, isDark } = useThemeStore();
  const pathname = usePathname();
  const [showTheme, setShowTheme] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const settingsButtonRef = useRef<HTMLButtonElement>(null);

  // 컴포넌트 마운트 감지
  useEffect(() => {
    setMounted(true);
  }, []);

  // 시스템 다크모드 감지 및 적용
  useEffect(() => {
    if (!mounted) return;

    try {
      // 시스템 다크모드 설정 확인
      const darkModeMediaQuery = window.matchMedia(
        '(prefers-color-scheme: dark)'
      );

      // 초기 시스템 설정 적용
      setIsDark(darkModeMediaQuery.matches);

      // 시스템 설정 변경 시 자동 적용
      const handleChange = (e: MediaQueryListEvent) => {
        setIsDark(e.matches);
      };

      // 최신 API 사용
      darkModeMediaQuery.addEventListener('change', handleChange);

      return () => {
        darkModeMediaQuery.removeEventListener('change', handleChange);
      };
    } catch (error) {
      console.error('다크모드 감지 중 오류:', error);
    }
  }, [mounted, setIsDark]);

  const handleSignOut = async () => {
    await signOut();
  };

  const toggleDarkMode = () => {
    console.log('다크모드 토글:', !isDark);
    setIsDark(!isDark);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleThemeSettings = () => {
    setShowTheme((prev) => !prev);
  };

  // 컴포넌트가 마운트되지 않았을 때는 아무것도 렌더링하지 않음
  if (!mounted) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/90 dark:bg-gray-900/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:supports-[backdrop-filter]:bg-gray-900/70">
      {/* 전체 컨테이너 */}
      <div className="max-w-full w-full px-4 mx-auto">
        <div className="flex h-14 sm:h-16 items-center justify-between">
          {/* 좌측: 로고와 로그인 버튼 */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <Link
              href="/"
              className="font-semibold text-headline text-ios-blue dark:text-ios-teal whitespace-nowrap mr-2 sm:mr-3"
            >
              MMGG
            </Link>

            {!loading && (
              <div className="hidden xs:block">
                {user ? (
                  <div className="flex items-center gap-2">
                    <span className="text-subhead font-medium truncate max-w-[80px] sm:max-w-[120px]">
                      {user.user_metadata.name || user.email?.split('@')[0]}
                    </span>
                    <Button
                      onClick={handleSignOut}
                      variant="outline"
                      className="py-1 px-2.5 text-footnote"
                    >
                      로그아웃
                    </Button>
                  </div>
                ) : (
                  <Link href="/login">
                    <Button
                      variant="outline"
                      className="py-1 px-2.5 text-footnote"
                    >
                      로그인
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* 중앙: 네비게이션 메뉴 (데스크톱에서만 표시) */}
          <nav className="hidden md:flex justify-center gap-2 lg:gap-2 overflow-x-auto scrollbar-hide">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  px-3 py-1.5 font-medium text-footnote whitespace-nowrap transition flex-shrink-0
                  ${
                    pathname === item.href
                      ? 'bg-ios-blue/10 text-ios-blue dark:bg-ios-teal/10 dark:text-ios-teal'
                      : 'bg-white/70 text-gray-700 hover:bg-gray-100/80 hover:text-ios-blue dark:bg-gray-800/70 dark:text-gray-300 dark:hover:bg-gray-700/80 dark:hover:text-ios-teal'
                  }
                  border border-gray-200/50 dark:border-gray-700/50
                `}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* 우측: 상태 정보 및 햄버거 메뉴 */}
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <Clock />

            {/* 다크모드 토글 버튼 */}
            <button
              onClick={toggleDarkMode}
              type="button"
              className="p-2 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition"
              aria-label={isDark ? '라이트모드로 전환' : '다크모드로 전환'}
            >
              {isDark ? (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-yellow-400"
                >
                  <circle cx="12" cy="12" r="5" />
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </svg>
              ) : (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-ios-blue"
                >
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>

            {/* 환경설정 톱니바퀴 버튼 */}
            <button
              onClick={toggleThemeSettings}
              type="button"
              className="p-2 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition"
              aria-label="테마 설정"
              ref={settingsButtonRef}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-ios-blue dark:text-ios-teal"
              >
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </button>
            {showTheme && (
              <ThemeSettings
                onClose={() => setShowTheme(false)}
                triggerRef={settingsButtonRef}
              />
            )}

            {/* 모바일에서 로그인 버튼 */}
            {!loading && (
              <div className="xs:hidden">
                {user ? (
                  <Button
                    onClick={handleSignOut}
                    variant="outline"
                    className="py-0.5 px-2 text-footnote"
                  >
                    로그아웃
                  </Button>
                ) : (
                  <Link href="/login">
                    <Button
                      variant="outline"
                      className="py-0.5 px-2 text-footnote"
                    >
                      로그인
                    </Button>
                  </Link>
                )}
              </div>
            )}

            {/* 햄버거 메뉴 토글 버튼 (태블릿 & 모바일) */}
            <button
              className="md:hidden p-2 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition"
              onClick={toggleMobileMenu}
              type="button"
              aria-label="메뉴 열기/닫기"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-ios-blue dark:text-ios-teal"
              >
                {mobileMenuOpen ? (
                  <path d="M18 6L6 18M6 6l12 12" />
                ) : (
                  <path d="M3 12h18M3 6h18M3 18h18" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* 모바일 메뉴 */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 pb-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col gap-2 px-3">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    px-4 py-2 font-medium text-footnote transition
                    ${
                      pathname === item.href
                        ? 'bg-ios-blue/10 text-ios-blue dark:bg-ios-teal/10 dark:text-ios-teal'
                        : 'bg-white/70 text-gray-700 hover:bg-gray-100/80 hover:text-ios-blue dark:bg-gray-800/70 dark:text-gray-300 dark:hover:bg-gray-700/80 dark:hover:text-ios-teal'
                    }
                    border border-gray-200/50 dark:border-gray-700/50
                  `}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {user && (
                <div className="text-caption-1 font-medium py-2 px-4 text-gray-500 dark:text-gray-400">
                  로그인: {user.user_metadata.name || user.email?.split('@')[0]}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
