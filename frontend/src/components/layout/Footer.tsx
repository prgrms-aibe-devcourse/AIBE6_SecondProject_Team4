import Link from 'next/link'

export default function Footer() {
    return (
        <footer className="bg-inverse-surface text-surface py-10 md:py-16">
            <div className="max-w-screen-xl mx-auto px-margin-desktop">
                {/* 모바일: 브랜드 + 링크 2열 / 데스크탑: 4열 */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-xl">
                    {/* 브랜드 */}
                    <div className="space-y-3">
                        <span className="font-headline-md text-headline-md">FitMate</span>
                        <p className="text-body-sm opacity-70 leading-relaxed">
                            모든 사람들이 더 나은 삶을 살 수 있도록<br className="hidden sm:block" /> 도와주는 피트니스 파트너
                        </p>
                        {/* 소셜 아이콘 — 모바일에서 브랜드 아래에 */}
                        <div className="flex gap-4 pt-1 md:hidden">
                            <span className="material-symbols-outlined cursor-pointer hover:text-primary opacity-70">share</span>
                            <span className="material-symbols-outlined cursor-pointer hover:text-primary opacity-70">mail</span>
                        </div>
                    </div>

                    {/* 모바일: Service + Support 2열 그리드 */}
                    <div className="grid grid-cols-2 gap-6 md:contents">
                        <div className="space-y-3">
                            <h5 className="font-label-bold text-label-bold">Service</h5>
                            <ul className="space-y-2 opacity-70 text-body-sm">
                                <li>
                                    <Link className="hover:text-primary transition-colors" href="/trainer">트레이너 찾기</Link>
                                </li>
                                <li>
                                    <Link className="hover:text-primary transition-colors" href="/matching">AI 맞춤 추천</Link>
                                </li>
                            </ul>
                        </div>

                        <div className="space-y-3">
                            <h5 className="font-label-bold text-label-bold">Support</h5>
                            <ul className="space-y-2 opacity-70 text-body-sm">
                                <li>
                                    <Link className="hover:text-primary transition-colors" href="/faq">고객센터</Link>
                                </li>
                                <li>
                                    <Link className="hover:text-primary transition-colors" href="/inquiry">1:1 문의</Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Contact — 모바일에서 숨기고 하단 바에 통합 */}
                    <div className="hidden md:block space-y-4">
                        <h5 className="font-label-bold text-label-bold">Contact</h5>
                        <ul className="space-y-2 opacity-70 text-body-sm">
                            <li>contact@fitmate.com</li>
                            <li>02-1234-5678</li>
                            <li className="flex gap-4 mt-4">
                                <span className="material-symbols-outlined cursor-pointer hover:text-primary">share</span>
                                <span className="material-symbols-outlined cursor-pointer hover:text-primary">mail</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* 하단 바 */}
                <div className="mt-8 md:mt-16 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 opacity-50 text-body-sm">
                    <span>© 2026 FitMate. All rights reserved.</span>
                    <span className="md:hidden">contact@fitmate.com</span>
                </div>
            </div>
        </footer>
    )
}
