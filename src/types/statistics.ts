export interface monthlyDataInt {
  month: string;
  reservas: number;
  ingresos: number;
}

export interface topServiceInt {
  name: string;
  bookings: number;
  revenue: number;
}

export interface performanceMetricsInt {
  title: string;
  value: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  color: string;
}
