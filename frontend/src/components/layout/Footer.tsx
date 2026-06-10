export default function Footer() {
    return (
        <footer className="bg-inverse-surface text-surface py-16">
            <div className="max-w-screen-xl mx-auto px-margin-desktop grid grid-cols-1 md:grid-cols-4 gap-xl">
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <span className="font-headline-md text-headline-md">FitMate</span>
                    </div>
                    <p className="text-body-sm opacity-70">
                        모든 사람들이 더 나은 삶을 살 수 있도록 도와주는 당신의 가장 가까운 피트니스
                        파트너
                    </p>
                </div>

                <div className="space-y-4">
                    <h5 className="font-label-bold text-label-bold">Service</h5>
                    <ul className="space-y-2 opacity-70 text-body-sm">
                        <li>
                            <a className="hover:text-primary transition-colors" href="#">
                                트레이너 찾기
                            </a>
                        </li>
                        <li>
                            <a className="hover:text-primary transition-colors" href="#">
                                AI 맞춤 추천
                            </a>
                        </li>
                        <li>
                            <a className="hover:text-primary transition-colors" href="#">
                                커뮤니티
                            </a>
                        </li>
                    </ul>
                </div>

                <div className="space-y-4">
                    <h5 className="font-label-bold text-label-bold">Support</h5>
                    <ul className="space-y-2 opacity-70 text-body-sm">
                        <li>
                            <a className="hover:text-primary transition-colors" href="#">
                                고객센터
                            </a>
                        </li>
                        <li>
                            <a className="hover:text-primary transition-colors" href="#">
                                FAQ
                            </a>
                        </li>
                        <li>
                            <a className="hover:text-primary transition-colors" href="#">
                                이용약관
                            </a>
                        </li>
                    </ul>
                </div>

                <div className="space-y-4">
                    <h5 className="font-label-bold text-label-bold">Contact</h5>
                    <ul className="space-y-2 opacity-70 text-body-sm">
                        <li>contact@fitmate.com</li>
                        <li>02-1234-5678</li>
                        <li className="flex gap-4 mt-4">
                            <span className="material-symbols-outlined cursor-pointer hover:text-primary">
                                share
                            </span>
                            <span className="material-symbols-outlined cursor-pointer hover:text-primary">
                                mail
                            </span>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="max-w-screen-xl mx-auto px-margin-desktop mt-16 pt-8 border-t border-white/10 text-center opacity-50 text-body-sm">
                © 2026 FitMate. All rights reserved.
            </div>
        </footer>
    )
}
