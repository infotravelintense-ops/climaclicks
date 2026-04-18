'use client';

import type { Language } from '@/app/types';

const languages: { code: Language; flag: string; name: string; short: string }[] = [
  { code: 'es', flag: '🇪🇸', name: 'Español', short: 'ES' },
  { code: 'en', flag: '🇬🇧', name: 'English', short: 'EN' },
  { code: 'de', flag: '🇩🇪', name: 'Deutsch', short: 'DE' },
  { code: 'it', flag: '🇮🇹', name: 'Italiano', short: 'IT' },
  { code: 'hu', flag: '🇭🇺', name: 'Magyar', short: 'HU' },
];

interface LanguageSelectorProps {
  current: Language;
  onChange: (lang: Language) => void;
  compact?: boolean;
}

export function LanguageSelector({ current, onChange, compact = false }: LanguageSelectorProps) {
  return (
    <div className={`flex gap-2 ${compact ? '' : 'justify-center'} items-center flex-wrap`}>
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => onChange(lang.code)}
          title={lang.name}
          className={`group flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all duration-200 border-2 ${
            current === lang.code
              ? 'border-blue-500 bg-blue-50 shadow-sm scale-105'
              : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/50'
          }`}
        >
          <span className="text-lg leading-none">{lang.flag}</span>
          <span className={`text-xs font-bold tracking-wide ${current === lang.code ? 'text-blue-700' : 'text-gray-600 group-hover:text-blue-600'}`}>
            {lang.short}
          </span>
        </button>
      ))}
    </div>
  );
}
