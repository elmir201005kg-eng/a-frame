import { useTranslations } from 'next-intl';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function Home() {
  const t = useTranslations('landing');

  return (
    <div className="flex flex-col flex-1 bg-white dark:bg-black">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">A-FRAME KG</h1>
          <LanguageSwitcher />
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              {t('hero.title')}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
              {t('hero.subtitle')}
            </p>
            
            {/* Search Form */}
            <div className="max-w-4xl mx-auto bg-gray-50 dark:bg-gray-900 p-6 rounded-lg shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder={t('hero.searchPlaceholder')}
                  className="px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
                <input
                  type="text"
                  placeholder={t('hero.datesLabel')}
                  className="px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
                <input
                  type="number"
                  placeholder={t('hero.guestsLabel')}
                  className="px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
              <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-md transition-colors">
                {t('hero.searchButton')}
              </button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-gray-50 dark:bg-gray-900 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
              {t('features.title')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {t('features.feature1.title')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {t('features.feature1.description')}
                </p>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {t('features.feature2.title')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {t('features.feature2.description')}
                </p>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {t('features.feature3.title')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {t('features.feature3.description')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Popular Destinations */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
              {t('popularDestinations.title')}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center p-4 border border-gray-200 dark:border-gray-800 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                <p className="font-medium text-gray-900 dark:text-white">{t('popularDestinations.issykKul')}</p>
              </div>
              <div className="text-center p-4 border border-gray-200 dark:border-gray-800 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                <p className="font-medium text-gray-900 dark:text-white">{t('popularDestinations.chonKemin')}</p>
              </div>
              <div className="text-center p-4 border border-gray-200 dark:border-gray-800 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                <p className="font-medium text-gray-900 dark:text-white">{t('popularDestinations.alaArcha')}</p>
              </div>
              <div className="text-center p-4 border border-gray-200 dark:border-gray-800 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                <p className="font-medium text-gray-900 dark:text-white">{t('popularDestinations.karakol')}</p>
              </div>
              <div className="text-center p-4 border border-gray-200 dark:border-gray-800 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                <p className="font-medium text-gray-900 dark:text-white">{t('popularDestinations.naryn')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-blue-600 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              {t('cta.title')}
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              {t('cta.description')}
            </p>
            <button className="bg-white text-blue-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-md transition-colors">
              {t('cta.button')}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
