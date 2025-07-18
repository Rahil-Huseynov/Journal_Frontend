'use client';

import { useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';

export default function InstructionsPage() {
    const locale = useLocale();
    const t = useTranslations('InstructionsForUsers');
    useEffect(() => {
        document.title = `${t('metaTitle')}`;
    }, [t]);
    const results = t.raw('results') as string[];
    const reasons = t.raw('reasons') as string[];
    const aakList = t.raw('aakList') as string[];


    return (
        <main className="min-h-screen bg-slate-100 py-8 px-4 md:py-14">
            <section className="mx-auto max-w-5xl rounded-2xl bg-white p-6 md:p-10 shadow-xl space-y-8">
                <h1 className="text-center text-3xl md:text-4xl font-extrabold text-indigo-800">
                    {t('header')}
                </h1>

                <h2 className="text-center text-2xl md:text-2xl font-bold text-indigo-700">
                    {t('title')}
                </h2>

                <p
                    className="text-lg leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: t.raw('intro') }}
                />

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-indigo-600">
                        {t('resultsTitle')}
                    </h2>
                    <ul className="list-disc list-inside space-y-1">
                        {results.map((item, idx) => (
                            <li key={idx}>{item}</li>
                        ))}
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-indigo-600">
                        {t('reasonsTitle')}
                    </h2>
                    <ul className="list-disc list-inside space-y-1">
                        {reasons.map((item, idx) => (
                            <li key={idx}>{item}</li>
                        ))}
                    </ul>
                </section>

                <p className="text-lg leading-relaxed">{t('guidelines')}</p>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-indigo-600">
                        {t('aakTitle')}
                    </h2>
                    <ol className="list-decimal list-inside space-y-2">
                        {aakList.map((item, idx) => (
                            <li
                                key={idx}
                                dangerouslySetInnerHTML={{ __html: item }}
                            />
                        ))}
                    </ol>
                </section>

                <p className="text-base italic text-gray-600">{t('finalNote')}</p>
            </section>
        </main>
    );
}
