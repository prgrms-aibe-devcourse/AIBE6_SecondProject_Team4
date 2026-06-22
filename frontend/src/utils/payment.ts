import { getAuthClient } from '@/utils/apiClient'
import { ANONYMOUS, loadTossPayments } from '@tosspayments/tosspayments-sdk'

const TOSS_CLIENT_KEY = 'test_ck_DpexMgkW36wMjxW5JvJMVGbR5ozO'

interface PrepareResponse {
    lessonRequestId: number
    trainerNickname: string
    sports: string
    lessonPassType: string
    packageCount: number | null
    pricePerSession: number
    amount: number
    orderId: string
    orderName: string
}

/**
 * 결제 시작
 * 1) 백엔드 prepare 호출 (orderId, amount 발급)
 * 2) 토스 결제창 띄움
 */
export async function startPayment(lessonRequestId: number) {
    const client = getAuthClient()

    // 1) 결제 준비
    const { data, error } = await client.POST('/api/payments/prepare/{lessonRequestId}', {
        params: { path: { lessonRequestId } },
    } as never)
    if (error || !data) {
        throw new Error('결제 준비에 실패했습니다.')
    }

    const info = data as PrepareResponse

    // 2) 토스 결제창
    const tossPayments = await loadTossPayments(TOSS_CLIENT_KEY)
    const payment = tossPayments.payment({ customerKey: ANONYMOUS })

    try {
        await payment.requestPayment({
            method: 'CARD',
            amount: {
                currency: 'KRW',
                value: info.amount,
            },
            orderId: info.orderId,
            orderName: info.orderName,
            successUrl: `${window.location.origin}/payment/success`,
            failUrl: `${window.location.origin}/payment/fail`,
            card: {
                useEscrow: false,
                flowMode: 'DEFAULT',
                useCardPoint: false,
                useAppCardOnly: false,
            },
        })
    } catch (err) {
        // 사용자가 결제창에서 취소/닫기 한 경우 → 정상 흐름, 조용히 종료
        const code = (err as { code?: string })?.code
        if (code === 'USER_CANCEL' || code === 'PAY_PROCESS_CANCELED') {
            return
        }
        // 그 외 실제 에러는 다시 throw (호출한 쪽에서 처리)
        throw err
    }
}
