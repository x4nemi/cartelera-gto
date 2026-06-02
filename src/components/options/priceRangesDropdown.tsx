import { Label, Slider } from "@heroui/react";
import { useState } from "react";

const priceSteps = ["Gratis", "$", "$$", "$$$"];

export const PriceRangesDropdown = () => {
    const maxIndex = priceSteps.length - 1;
    const [values, setValues] = useState<number[]>([0, maxIndex]);

    const snapNearestThumb = (target: number) => {
        setValues((prev) => {
            const [min, max] = prev;
            const distMin = Math.abs(target - min);
            const distMax = Math.abs(target - max);
            // move whichever thumb is closer; keep order valid
            if (distMin <= distMax) {
                return [Math.min(target, max), max];
            }
            return [min, Math.max(target, min)];
        });
    };

    return (
        <Slider
            className="w-full max-w-xs"
            value={values}
            onChange={(v) => setValues(v as number[])}
            maxValue={maxIndex}
            minValue={0}
            step={1}
        >
            <Label>Rango de precios</Label>
            <Slider.Track className="relative mt-2 mb-6 h-1 rounded-full bg-content1">
                {({ state }) => (
                    <>
                        <Slider.Fill className="h-1 rounded-full bg-accent" />

                        {/* tick marks — clickable */}
                        {priceSteps.map((_, i) => {
                            const isActive = state.values.includes(i);
                            return (
                                <button
                                    key={`tick-${i}`}
                                    type="button"
                                    aria-label={`Seleccionar ${priceSteps[i]}`}
                                    onClick={() => snapNearestThumb(i)}
                                    className={[
                                        "absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all",
                                        "hover:size-2.5 hover:shadow-md",
                                        isActive
                                            ? "size-3 bg-accent shadow"
                                            : "size-1.5 bg-foreground hover:bg-foreground/80",
                                    ].join(" ")}
                                    style={{ left: `${(i / maxIndex) * 100}%` }}
                                />
                            );
                        })}

                        {priceSteps.map((label, i) => (
                            <span
                                key={`label-${i}`}
                                className="absolute top-full mt-2 -translate-x-1/2 text-xs select-none text-default-800"
                                style={{ left: `${(i / maxIndex) * 100}%` }}
                            >
                                {label}
                            </span>
                        ))}

                        {state.values.map((_, i) => (
                            <Slider.Thumb
                                key={i}
                                index={i}
                                className="size-4 rounded-full bg-accent shadow ring-2 ring-accent"
                            />
                        ))}
                    </>
                )}
            </Slider.Track>
        </Slider>
    );
};
