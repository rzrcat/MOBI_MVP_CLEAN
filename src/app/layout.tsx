import type { Metadata } from 'next';
import { Noto_Sans_KR } from 'next/font/google';
import './globals.css';
import '../styles/fonts.css';
import { Header } from '@/components/core/Header';
import React from 'react';
import Head from 'next/head';
import { ThemeClientEffect } from '@/components/core/ThemeClientEffect';

const notoSansKr = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  preload: true,
});

export const metadata: Metadata = {
  title: 'MMGG - 마비노기 모바일 정보 & 커뮤니티',
  description:
    '마비노기 모바일의 모든 정보를 한눈에! 룬 도감, 코디 도감, 경험치 계산기 등 다양한 도구를 제공합니다.',
  keywords: ['마비노기 모바일', '룬', '코디', '계산기', '게임정보', '커뮤니티'],
  openGraph: {
    title: 'MMGG - 마비노기 모바일 커뮤니티',
    description: '마비노기 모바일의 모든 정보를 한눈에!',
    type: 'website',
    locale: 'ko_KR',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={`${notoSansKr.className} font-noonnu`}>
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#007AFF" />
        <link rel="icon" href="/images/icons/icon-192.png" />
        <link rel="apple-touch-icon" href="/images/icons/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </Head>
      <body className="bg-white min-h-screen">
        <ThemeClientEffect />
        <Header />
        <main className="w-full max-w-full px-2 sm:px-4 py-4 sm:py-6 bg-white">
          {children}
        </main>
        <footer className="bg-gray-50 border-t">
          <div className="container mx-auto px-4 py-8">
            <p className="text-sm text-gray-600">
              © 2025 MMGG. 이 사이트는 넥슨에서 제작하거나 운영하지 않습니다.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
