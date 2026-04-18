'use client';

import Image from 'next/image';
import type { Language } from '@/app/types';

const languages: { code: Language; flagSrc: string; name: string; short: string }[] = [
  { code: 'es', flagSrc: '/flags/es.svg', name: 'Español', short: 'ES' },
  { code: 'en', flagSrc: '/flags/gb.svg', name: 'English', short: 'EN' },
  { code: 'de', flagSrc: '/flags/de.svg', name: 'Deutsch', short: 'DE' },
  { code: 'it', flagSrc: '/flags/it.svg', name: 'Italiano', short: 'IT' },
  { code: 'hu', flagSrc: '/flags/hu.svg', name: 'Magyar', short: 'HU' },
];

interface LanguageSelectorProps {
  current: Language;
  onChange: (lang: Language) => void;
  compact?: boolean;
}

export function LanguageSelector({ current, onChange, compact = false }: LanguageSelectorProps) {
  return (
    <div className={`flex gap-2 ${compact ? '' : 'justify-center'} items-center flex-wrap`}>
      {languages.map((lang) => {
        const active = current === lang.code;
        return (
          <button
            key={lang.code}
            onClick={() => onChange(lang.code)}
            title={lang.name}
            aria-label={lang.name}
            className={`group flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all duration-200 border-2 ${
              active
                ? 'border-blue-500 bg-blue-50 shadow-sm scale-105'
                : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/50'
            }`}
          >
            <span
              className={`relative block w-6 h-[14px] overflow-hidden rounded-[2px] ring-1 ${
                active ? 'ring-blue-400' : 'ring-gray-200'
              } flex-shrink-0 shadow-sm`}
            >
              <Image
                src={lang.flagSrc}
                alt={`${lang.name} flag`}
                fill
                sizes="24px"
                className="object-cover"
                priority={lang.code === 'es'}
              />
            </span>
            <span
              className={`text-xs font-bold tracking-wide ${
                active ? 'text-blue-700' : 'text-gray-600 group-hover:text-blue-600'
              }`}
            >
              {lang.short}
            </span>
          </button>
        );
      })}
    </div>
  );
}
