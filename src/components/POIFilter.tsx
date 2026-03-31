"use client";

/**
 * POI category filter chips.
 */

import type { POICategory } from "@/types/poi";
import { POI_CATEGORY_META } from "@/types/poi";

interface POIFilterProps {
    activeCategories: Set<POICategory>;
    onToggle: (cat: POICategory) => void;
}

const CATEGORIES: POICategory[] = ["hotel", "restaurant", "artisan", "cultural"];

export default function POIFilter({
    activeCategories,
    onToggle,
}: POIFilterProps) {
    return (
        <div className="poi-filter">
            {CATEGORIES.map((cat) => {
                const meta = POI_CATEGORY_META[cat];
                const active = activeCategories.has(cat);
                return (
                    <button
                        key={cat}
                        className={`filter-chip ${active ? "active" : ""}`}
                        style={
                            active
                                ? { background: meta.color, borderColor: meta.color }
                                : {}
                        }
                        onClick={() => onToggle(cat)}
                    >
                        <span>{meta.icon}</span>
                        <span>{meta.labelFr}</span>
                    </button>
                );
            })}
        </div>
    );
}
