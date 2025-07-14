export interface monthlyDataInt {
  month: string;
  booking: number;
  income: number;
}

export interface topServiceInt {
  name: string;
  bookings: number;
  revenue?: number;
}

export interface performanceMetricsInt {
  title: string;
  value: string | number;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  color: string;
}
