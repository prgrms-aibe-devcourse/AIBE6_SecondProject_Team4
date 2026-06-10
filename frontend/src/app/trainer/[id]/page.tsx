interface Props {
    params: Promise<{ id: string }>
}

export default async function TrainerDetailPage({ params }: Props) {
    const { id } = await params

    return (
        <main className="pt-16 md:pt-20">
            <div className="max-w-screen-xl mx-auto px-margin-mobile md:px-margin-desktop py-xl">
                <h1 className="font-headline-md text-headline-md">트레이너 상세</h1>
                <p className="text-body-md text-secondary mt-2">ID: {id}</p>
            </div>
        </main>
    )
}
