import { Label, Slider } from "@heroui/react";

const priceSteps = ["Gratis", "$", "$$", "$$$"];

export const PriceRangesDropdown = () => {
    const maxIndex = priceSteps.length - 1;

    return (
        <Slider
            className="w-full max-w-xs"
            defaultValue={[0, maxIndex]}
            maxValue={maxIndex}
            minValue={0}
            step={1}
            
        >
            <Label>Rango de precios</Label>
            <Slider.Track className="relative mt-2 mb-6 h-1 rounded-full bg-content1">
                {({ state }) => (
                    <>
                        <Slider.Fill className="h-1 rounded-full bg-accent" />

                        {/* tick marks */}
                        {priceSteps.map((_, i) => (
                            <span
                                key={`tick-${i}`}
                                aria-hidden
                                className="absolute top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground"
                                style={{ left: `${(i / maxIndex) * 100}%` }}
                            />
                        ))}

                        {priceSteps.map((label, i) => (
                            <span
                                key={`label-${i}`}
                                className="absolute top-full mt-2 -translate-x-1/2 text-xs select-none"
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
