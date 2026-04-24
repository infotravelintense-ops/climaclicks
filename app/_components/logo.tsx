'use client';

import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
  variant?: 'color' | 'white';
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ className = '', showText = true, variant = 'color', size = 'md' }: LogoProps) {
  const sizeMap = {
    sm: { icon: 32, fontSize: 16 },
    md: { icon: 40, fontSize: 22 },
    lg: { icon: 56, fontSize: 30 },
  };

  const { icon: iconSize, fontSize } = sizeMap[size];
  const textColor = variant === 'white' ? '#ffffff' : '#0f172a';
  const gradientId = `climaya-gradient-${variant}-${size}`;
  const startColor = variant === 'white' ? '#93c5fd' : '#1e40af';
  const endColor = variant === 'white' ? '#a5f3fc' : '#06b6d4';

  if (!showText) {
    return (
      <svg
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        width={iconSize}
        height={iconSize}
        className={className}
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={startColor} />
            <stop offset="100%" stopColor={endColor} />
          </linearGradient>
        </defs>
        <circle cx="20" cy="20" r="18" fill={`url(#${gradientId})`} opacity="0.12" />
        <path
          d="M 20 4 A 16 16 0 0 1 36 20 A 16 16 0 0 1 20 36 A 16 16 0 0 1 4 20 A 16 16 0 0 1 12 7.5"
          stroke={`url(#${gradientId})`}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <g stroke={endColor} strokeWidth="1.8" strokeLinecap="round">
          <line x1="20" y1="14" x2="20" y2="26" />
          <line x1="14.8" y1="17" x2="25.2" y2="23" />
          <line x1="14.8" y1="23" x2="25.2" y2="17" />
        </g>
        <circle cx="20" cy="20" r="2" fill={startColor} />
      </svg>
    );
  }

  const totalWidth = 240 + (size === 'lg' ? 40 : 0);

  return (
    <svg
      viewBox={`0 0 ${totalWidth} 40`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      height={iconSize}
      className={className}
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={startColor} />
          <stop offset="100%" stopColor={endColor} />
        </linearGradient>
      </defs>
      <g>
        <circle cx="20" cy="20" r="18" fill={`url(#${gradientId})`} opacity="0.12" />
        <path
          d="M 20 4 A 16 16 0 0 1 36 20 A 16 16 0 0 1 20 36 A 16 16 0 0 1 4 20 A 16 16 0 0 1 12 7.5"
          stroke={`url(#${gradientId})`}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <g stroke={endColor} strokeWidth="1.8" strokeLinecap="round">
          <line x1="20" y1="14" x2="20" y2="26" />
          <line x1="14.8" y1="17" x2="25.2" y2="23" />
          <line x1="14.8" y1="23" x2="25.2" y2="17" />
        </g>
        <circle cx="20" cy="20" r="2" fill={startColor} />
      </g>
      <text
        x="50"
        y="27"
        fontFamily="'Inter', system-ui, -apple-system, sans-serif"
        fontSize={fontSize}
        fontWeight="700"
        fill={textColor}
        letterSpacing="-0.5"
      >
        ClimaClicks
      </text>
    </svg>
  );
}
