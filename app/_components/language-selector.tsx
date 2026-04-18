'use client';

import type { Language } from '@/app/types';

const languages: { code: Language; flag: string; name: string }[] = [
  { code: 'es', flag: '🇪🇸', name: 'Español' },
  { code: 'en', flag: '🇬🇧', name: 'English' },
  { code: 'de', flag: '🇩🇪', name: 'Deutsch' },
  { code: 'it', flag: '🇮🇹', name: 'Italiano' },
  { code: 'hu', flag: '🇭🇺', name: 'Magyar' },
];

interface LanguageSelectorProps {
  current: Language;
  onChange: (lang: Language) => void;
}

export function LanguageSelector({ current, onChange }: LanguageSelectorProps) {
  return (
    <div className="flex gap-3 justify-center mb-8">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => onChange(lang.code)}
          title={lang.name}
          className={`text-2xl px-3 py-2 rounded-lg transition-all border-2 ${
            current === lang.code
              ? 'border-blue-500 bg-blue-50'
              : 'border-transparent hover:border-gray-300'
          }`}
        >
          {lang.flag}
        </button>
      ))}
    </div>
  );
}