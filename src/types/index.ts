import { DateValue } from "@heroui/react";
import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface EventDate {
  dates: DateValue[];
}

export interface WorkshopDate {
  workshopDays: string[];
  until: DateValue | null;
  every: number;
}

export interface DateRange {
  dateRange: { start: DateValue | null; end: DateValue | null };
}