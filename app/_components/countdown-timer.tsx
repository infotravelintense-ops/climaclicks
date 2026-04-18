'use client';

import { useEffect, useState } from 'react';
import { Clock, AlertCircle } from 'lucide-react';
import { formatCurrency } from '@/app/utils/calculations';

interface CountdownTimerProps {
  totalPrice: number;
  discountPercentage: number;
  discountedPrice: number;
  onExpired?: () => void;
}

export function CountdownTimer({
  totalPrice,
  discountPercentage,
  discountedPrice,
  onExpired,
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutos = 300 segundos
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (isExpired) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsExpired(true);
          onExpired?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isExpired, onExpired]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const displayTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  if (isExpired) {
    return (
      <div className="bg-gray-100 p-6 rounded-lg border-2 border-gray-300">
        <div className="flex items-center justify-center gap-2 text-gray-600">
          <AlertCircle className="w-5 h-5" />
          <p>La oferta temporal ha expirado. Precio: {formatCurrency(totalPrice)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border-2 border-green-300">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 text-gray-600 mb-2">
          <Clock className="w-4 h-4" />
          <p>{discountPercentage}% de descuento durante</p>
        </div>
        <p className="text-4xl font-bold text-green-600 mb-4 font-mono">
          {displayTime}
        </p>
        <p className="text-2xl font-bold text-gray-900 mb-2">
          {formatCurrency(discountedPrice)}
        </p>
        <p className="text-sm text-gray-600">
          Precio original: {formatCurrency(totalPrice)}
        </p>
      </div>
    </div>
  );
}