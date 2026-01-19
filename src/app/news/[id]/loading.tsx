export default function Loading() {
    return (
        <div className="relative min-h-screen yuzu-shell px-4 pb-24 pt-10 text-ink">
            <div className="pointer-events-none absolute inset-0 yuzu-bg opacity-35" />
            <div className="relative mx-auto max-w-3xl rounded-3xl soft-card p-6 text-center">
                正在加载详情...
            </div>
        </div>
    );
}
