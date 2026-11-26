import type { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://flipseer.com/predict',
  },
};

export default function PredictLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
