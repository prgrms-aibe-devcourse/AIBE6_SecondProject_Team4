'use client'

import Link from 'next/link'

export default function InquiryCompletePage() {
    return (
        <main className="flex-1 bg-background">
            <div className="max-w-[520px] mx-auto px-6 py-24 text-center">
                {/* 체크 아이콘 */}
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
                    <span className="material-symbols-outlined text-[56px] text-primary">check_circle</span>
                </div>

                <h1 className="font-bold text-2xl md:text-3xl text-on-surface mb-4">
                    문의가 접수되었습니다
                </h1>

                <p className="text-on-surface-variant text-sm md:text-base leading-relaxed mb-10 break-keep">
                    영업일 기준 24시간 이내에 답변 드리겠습니다.{' '}
                    답변은 마이페이지 &gt; 내 문의 내역에서 확인하실 수 있습니다.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Link
                        href="/mypage"
                        className="w-full sm:w-auto px-8 py-3 bg-primary text-on-primary font-semibold text-sm rounded-xl hover:bg-primary-container transition-all active:scale-95 inline-flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined text-[18px]">person</span>
                        마이페이지로 이동
                    </Link>
                    <Link
                        href="/faq"
                        className="w-full sm:w-auto px-8 py-3 bg-surface-container-highest text-on-surface-variant font-semibold text-sm rounded-xl hover:bg-surface-dim transition-all active:scale-95 inline-flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                        고객 지원으로 돌아가기
                    </Link>
                </div>
            </div>
        </main>
    )
}
