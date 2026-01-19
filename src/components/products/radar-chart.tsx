export function RadarChart({
    data,
}: {
    data: {
        usability: number;
        features: number;
        price: number;
        community: number;
        overall: number;
    };
}) {
    // 简单实现一个 SVG 雷达图
    // 5个轴：Top(Usability), Right(Features), BottomRight(Price), BottomLeft(Community), Left(Overall)
    // 实际上 Overall 已经在中间显示了，我们用 4个维度画图 或者 5个
    // 这里我们用 5边形

    const size = 200;
    const center = size / 2;
    const radius = 80;

    const maxScore = 5;

    // Helper to calculate points
    const getPoint = (score: number, angle: number) => {
        const r = (score / maxScore) * radius;
        const x = center + r * Math.cos(angle - Math.PI / 2);
        const y = center + r * Math.sin(angle - Math.PI / 2);
        return `${x},${y}`;
    };

    const angles = [
        0,
        (2 * Math.PI) / 5,
        (4 * Math.PI) / 5,
        (6 * Math.PI) / 5,
        (8 * Math.PI) / 5,
    ];

    // 5 Dimensions: Usability, Features, Price, Community, Overall
    const scores = [
        data.usability,
        data.features,
        data.price,
        data.community,
        data.overall,
    ];
    const labels = ["易用性", "功能", "价格", "社区", "综合"];

    const polyPoints = scores.map((s, i) => getPoint(s, angles[i])).join(" ");
    const bgPoints = scores.map((_, i) => getPoint(5, angles[i])).join(" "); // Max pentagon
    const midPoints = scores.map((_, i) => getPoint(2.5, angles[i])).join(" "); // Mid pentagon

    return (
        <div className="relative flex flex-col items-center">
            <svg width={size} height={size} className="overflow-visible">
                {/* Background Grid */}
                <polygon
                    points={bgPoints}
                    fill="var(--yuzu-wash)"
                    stroke="var(--yuzu-ink)"
                    strokeWidth="2"
                />
                <polygon
                    points={midPoints}
                    fill="none"
                    stroke="var(--yuzu-ink)"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                    opacity="0.25"
                />

                {/* Data Polygon */}
                <polygon
                    points={polyPoints}
                    fill="var(--yuzu-lemon)"
                    fillOpacity="0.7"
                    stroke="var(--yuzu-ink)"
                    strokeWidth="2"
                />

                {/* Axis Lines & Labels */}
                {angles.map((angle, i) => {
                    const end = getPoint(5, angle);
                    const [x, y] = end.split(",").map(Number);

                    // Label Position (push out a bit)
                    const labelR = radius + 20;
                    const labelX =
                        center + labelR * Math.cos(angle - Math.PI / 2);
                    const labelY =
                        center + labelR * Math.sin(angle - Math.PI / 2);

                    return (
                        <g key={i}>
                            <line
                                x1={center}
                                y1={center}
                                x2={x}
                                y2={y}
                                stroke="var(--yuzu-ink)"
                                strokeWidth="1"
                                opacity="0.2"
                            />
                            <text
                                x={labelX}
                                y={labelY}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                className="text-[10px] font-semibold uppercase tracking-wide"
                                fill="var(--yuzu-ink)"
                            >
                                {labels[i]}
                            </text>
                            {/* Score Value */}
                            <text
                                x={labelX}
                                y={labelY + 12}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                className="text-[10px] font-semibold"
                                fill="#3b6dd8"
                            >
                                {scores[i]}
                            </text>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
}
