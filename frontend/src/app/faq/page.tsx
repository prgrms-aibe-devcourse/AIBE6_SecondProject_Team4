'use client'

import Link from 'next/link'
import { useState } from 'react'

type Category = '전체' | '매칭' | '트레이너' | '기타'

interface FaqItem {
    category: Exclude<Category, '전체'>
    question: string
    answer: string
    badgeColor: string
    badgeTextColor: string
}

const faqItems: FaqItem[] = [
    // 매칭 (5개)
    {
        category: '매칭',
        question: '트레이너 매칭은 어떻게 이루어지나요?',
        answer: 'AI가 회원님의 목표, 선호 운동 스타일, 지역을 분석하여 최적의 트레이너를 추천합니다. 정교한 알고리즘을 통해 회원님의 건강 상태와 운동 레벨에 최적화된 맞춤형 매칭 경험을 제공합니다.',
        badgeColor: 'bg-[#0057cd]/10',
        badgeTextColor: 'text-[#0057cd]',
    },
    {
        category: '매칭',
        question: '매칭된 트레이너가 마음에 들지 않으면 어떻게 하나요?',
        answer: '마이페이지에서 매칭 취소 후 재매칭을 요청할 수 있습니다. 피트메이트는 회원님의 만족도를 최우선으로 하며, 변경 과정에서 발생할 수 있는 불편함을 최소화하기 위해 노력하고 있습니다.',
        badgeColor: 'bg-[#0057cd]/10',
        badgeTextColor: 'text-[#0057cd]',
    },
    {
        category: '매칭',
        question: '매칭 후 첫 수업까지 얼마나 걸리나요?',
        answer: '매칭 완료 후 트레이너와 채팅을 통해 일정을 협의하게 됩니다. 일반적으로 매칭 후 1~3일 이내에 첫 수업을 시작하실 수 있으며, 트레이너의 일정에 따라 당일 수업도 가능합니다.',
        badgeColor: 'bg-[#0057cd]/10',
        badgeTextColor: 'text-[#0057cd]',
    },
    {
        category: '매칭',
        question: '원하는 운동 종목을 선택해서 매칭받을 수 있나요?',
        answer: '네, 매칭 시작 전 PT, 필라테스, 요가, 크로스핏 등 원하시는 운동 종목을 선택하실 수 있습니다. 선택한 종목을 전문으로 하는 트레이너 중에서 최적의 매칭이 이루어집니다.',
        badgeColor: 'bg-[#0057cd]/10',
        badgeTextColor: 'text-[#0057cd]',
    },
    {
        category: '매칭',
        question: '지역 기반 매칭은 어떻게 설정하나요?',
        answer: '회원 프로필의 위치 정보를 기반으로 인근 트레이너를 우선 추천합니다. 마이페이지 > 프로필 설정에서 선호 활동 지역을 변경하시면 해당 지역의 트레이너로 재매칭을 받으실 수 있습니다.',
        badgeColor: 'bg-[#0057cd]/10',
        badgeTextColor: 'text-[#0057cd]',
    },

    // 트레이너 (5개)
    {
        category: '트레이너',
        question: '트레이너 자격 인증은 어떻게 확인하나요?',
        answer: '모든 트레이너는 국가 공인 자격증 및 경력을 FitMate 전문가 팀에서 직접 검증한 인증 트레이너입니다. 프로필 페이지에서 각 트레이너의 자격증 사본 인증 마크를 직접 확인하실 수 있습니다.',
        badgeColor: 'bg-[#cf4b00]/10',
        badgeTextColor: 'text-[#cf4b00]',
    },
    {
        category: '트레이너',
        question: '트레이너로 등록하려면 어떻게 해야 하나요?',
        answer: '회원가입 시 트레이너 유형으로 선택하신 후 자격증 및 경력 서류를 제출하시면 됩니다. 서류 검토는 영업일 기준 2~3일 소요되며, 승인 완료 후 프로필을 설정하고 매칭을 시작하실 수 있습니다.',
        badgeColor: 'bg-[#cf4b00]/10',
        badgeTextColor: 'text-[#cf4b00]',
    },
    {
        category: '트레이너',
        question: '트레이너 리뷰는 어떻게 작성하나요?',
        answer: '수업 완료 후 마이페이지 > 수업 내역에서 해당 수업에 대한 별점과 리뷰를 작성하실 수 있습니다. 리뷰는 수업 종료 후 7일 이내에 작성 가능하며, 작성된 리뷰는 트레이너 프로필에 공개됩니다.',
        badgeColor: 'bg-[#cf4b00]/10',
        badgeTextColor: 'text-[#cf4b00]',
    },
    {
        category: '트레이너',
        question: '트레이너의 수업 방식을 미리 알 수 있나요?',
        answer: '트레이너 프로필 페이지에서 전문 분야, 수업 스타일, 경력, 보유 자격증, 이전 수강생 리뷰를 상세히 확인하실 수 있습니다. 또한 매칭 전 채팅을 통해 트레이너에게 직접 문의하실 수도 있습니다.',
        badgeColor: 'bg-[#cf4b00]/10',
        badgeTextColor: 'text-[#cf4b00]',
    },
    {
        category: '트레이너',
        question: '트레이너가 갑자기 수업을 취소하면 어떻게 되나요?',
        answer: '트레이너의 귀책 사유로 수업이 취소될 경우 해당 회차는 환불되거나 일정 재조율 후 보강 수업으로 대체됩니다. 반복적인 취소 발생 시 고객센터에 신고하시면 페널티 조치 후 재매칭을 도와드립니다.',
        badgeColor: 'bg-[#cf4b00]/10',
        badgeTextColor: 'text-[#cf4b00]',
    },

    // 기타 (5개)
    {
        category: '기타',
        question: '회원 탈퇴는 어떻게 하나요?',
        answer: '마이페이지 > 계정 설정에서 탈퇴 신청이 가능합니다. 탈퇴 시 기존 운동 기록 및 멤버십 혜택이 모두 소멸되오니 신중히 결정해 주시기 바랍니다.',
        badgeColor: 'bg-gray-200/50',
        badgeTextColor: 'text-gray-500',
    },
    {
        category: '기타',
        question: '비밀번호를 잊어버렸어요. 어떻게 재설정하나요?',
        answer: '로그인 화면에서 "비밀번호 찾기"를 클릭하신 후 가입 시 등록한 이메일 주소를 입력하시면 재설정 링크가 발송됩니다. 링크 유효 시간은 30분이며, 만료 시 다시 요청하실 수 있습니다.',
        badgeColor: 'bg-gray-200/50',
        badgeTextColor: 'text-gray-500',
    },
    {
        category: '기타',
        question: '개인정보는 어떻게 보호되나요?',
        answer: 'FitMate는 개인정보 보호법에 따라 회원님의 정보를 안전하게 암호화하여 보관합니다. 수집된 정보는 서비스 제공 목적 외에 제3자에게 제공되지 않으며, 자세한 내용은 개인정보 처리방침에서 확인하실 수 있습니다.',
        badgeColor: 'bg-gray-200/50',
        badgeTextColor: 'text-gray-500',
    },
    {
        category: '기타',
        question: '앱 사용 중 오류가 발생했을 때 어떻게 하나요?',
        answer: '앱을 최신 버전으로 업데이트한 후 재시도해 주세요. 문제가 지속된다면 고객센터 1:1 문의를 통해 오류 내용과 발생 화면 캡처를 함께 보내주시면 빠르게 해결해 드리겠습니다.',
        badgeColor: 'bg-gray-200/50',
        badgeTextColor: 'text-gray-500',
    },
    {
        category: '기타',
        question: '서비스 이용 가능 시간이 있나요?',
        answer: 'FitMate 서비스는 24시간 365일 이용 가능합니다. 다만 정기 점검 시간(매주 화요일 새벽 2~4시)에는 일시적으로 서비스가 중단될 수 있습니다. 점검 일정은 사전에 공지사항을 통해 안내드립니다.',
        badgeColor: 'bg-gray-200/50',
        badgeTextColor: 'text-gray-500',
    },
]

const categories: Category[] = ['전체', '매칭', '트레이너', '기타']

export default function FaqPage() {
    const [activeCategory, setActiveCategory] = useState<Category>('전체')
    const [openIndex, setOpenIndex] = useState<number | null>(null)
    const [searchQuery, setSearchQuery] = useState('')

    const filtered = faqItems.filter((item) => {
        const matchCategory = activeCategory === '전체' || item.category === activeCategory
        const matchSearch =
            searchQuery === '' ||
            item.question.includes(searchQuery) ||
            item.answer.includes(searchQuery)
        return matchCategory && matchSearch
    })

    const handleToggle = (index: number) => {
        setOpenIndex((prev) => (prev === index ? null : index))
    }

    const handleCategoryChange = (cat: Category) => {
        setActiveCategory(cat)
        setOpenIndex(null)
    }

    return (
        <main className="flex-1">
            {/* Hero Section */}
            <section className="relative h-[360px] md:h-[400px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0057cd]/10 to-[#f9f9ff]" />
                    <img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBm2IqZ3m9gb28kEHHHy_ALx_2Eu2qqI3fZmVaCFyn7Vq_QPBXuzW99mWGvaxhHWX6uZj7sYYm8w4iV_tRWJ5GjOyUTaUsrvn8OYsWY4S7etVcDKjx5KYLZLd1xMoLs5YNFAceiEpEofVgPmMj3qnMgKCnwROpgR_GW1M4fDrkAOAfWJfz8ivlwfZD3Wi1Tbt8XbZMSl1_WTbBkBrdECWaTAU_dB37hvT8hrBBYfp6U3f_wUJRJuem6raD5HW0fNNjlL8UKMiAQFg"
                        alt="Fitness center"
                        className="w-full h-full object-cover mix-blend-overlay"
                    />
                </div>
                <div className="relative z-10 w-full max-w-3xl px-4 md:px-0 text-center">
                    <h1 className="font-bold text-2xl sm:text-4xl md:text-5xl text-[#181c24] mb-8 tracking-tight">
                        무엇을 도와드릴까요?
                    </h1>
                    <div className="relative group">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value)
                                setOpenIndex(null)
                            }}
                            className="w-full h-14 md:h-16 pl-14 pr-6 rounded-xl border-none bg-white/90 shadow-xl focus:ring-2 focus:ring-[#0057cd] text-base md:text-lg placeholder:text-gray-400 outline-none transition-all"
                            placeholder="궁금한 내용을 검색해보세요 (예: 매칭, 환불)"
                        />
                        <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-[#0057cd] text-3xl group-focus-within:scale-110 transition-transform">
                            search
                        </span>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="max-w-[1440px] mx-auto px-4 md:px-16 py-16 md:py-20">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Category Tabs */}
                    <div className="w-full md:w-1/4 flex flex-col gap-3">
                        <h2 className="font-semibold text-xl text-[#181c24] mb-2">카테고리</h2>
                        <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => handleCategoryChange(cat)}
                                    className={`px-5 py-3 rounded-xl text-sm font-semibold text-left transition-all active:scale-[0.98] whitespace-nowrap ${
                                        activeCategory === cat
                                            ? 'bg-[#016eff] text-white shadow-sm'
                                            : 'bg-[#f1f3ff] text-[#424655] hover:bg-[#e6e8f3]'
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* FAQ Accordion */}
                    <div className="w-full md:w-3/4 flex flex-col gap-3">
                        {filtered.length === 0 && (
                            <div className="text-center py-16 text-gray-400">
                                <span className="material-symbols-outlined text-5xl mb-3 block">search_off</span>
                                검색 결과가 없습니다.
                            </div>
                        )}
                        {filtered.map((item, index) => {
                            const isOpen = openIndex === index
                            return (
                                <div
                                    key={index}
                                    className="bg-white rounded-xl shadow-sm border border-[#c2c6d8]/30 overflow-hidden transition-all"
                                    style={{
                                        borderColor: isOpen
                                            ? 'rgba(0,87,205,0.4)'
                                            : 'rgba(194,198,216,0.3)',
                                    }}
                                >
                                    <button
                                        onClick={() => handleToggle(index)}
                                        className="w-full flex items-center justify-between p-4 md:p-6 text-left hover:bg-[#f1f3ff] transition-colors group cursor-pointer"
                                    >
                                        <div className="flex flex-wrap items-center gap-2 pr-2">
                                            <span
                                                className={`px-3 py-1 text-xs rounded-full font-semibold tracking-wide shrink-0 ${item.badgeColor} ${item.badgeTextColor}`}
                                            >
                                                {item.category}
                                            </span>
                                            <span className="font-semibold text-base md:text-lg text-[#181c24] group-hover:text-[#0057cd] transition-colors">
                                                {item.question}
                                            </span>
                                        </div>
                                        <span
                                            className={`material-symbols-outlined text-gray-400 transition-transform shrink-0 ${isOpen ? 'rotate-180' : ''}`}
                                        >
                                            expand_more
                                        </span>
                                    </button>

                                    <div
                                        className="overflow-hidden transition-all duration-300 ease-in-out"
                                        style={{ maxHeight: isOpen ? '500px' : '0' }}
                                    >
                                        <div className="px-4 md:px-12 py-4 text-[#424655] bg-[#f9f9ff] border-t border-[#c2c6d8]/10">
                                            <div className="flex gap-4">
                                                <span className="text-[#0057cd] font-bold text-xl shrink-0">A.</span>
                                                <p className="text-sm md:text-base leading-relaxed">{item.answer}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-[#f1f3ff] py-16 md:py-20">
                <div className="max-w-[1440px] mx-auto px-4 md:px-16 text-center">
                    <div className="bg-[#0057cd] p-8 md:p-20 rounded-[2rem] shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
                        <div className="relative z-10">
                            <h2 className="font-bold text-2xl sm:text-4xl md:text-5xl text-white mb-4 tracking-tight">
                                원하시는 답변을 찾지 못하셨나요?
                            </h2>
                            <p className="text-[#d9e2ff] text-base md:text-lg mb-10 max-w-2xl mx-auto">
                                FitMate 고객센터는 회원님의 건강한 변화를 위해 언제나 열려 있습니다.
                                궁금하신 내용을 보내주시면 전문가가 직접 답변해 드립니다.
                            </p>
                            <Link
                                href="/inquiry"
                                className="bg-white text-[#0057cd] px-10 py-4 rounded-xl font-semibold text-base md:text-lg hover:bg-[#f1f3ff] hover:scale-105 active:scale-95 transition-all shadow-xl inline-flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined">support_agent</span>
                                1:1 문의하기
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}
