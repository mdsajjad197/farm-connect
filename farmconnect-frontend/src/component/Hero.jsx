import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Hero() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <section className="relative w-full bg-white overflow-hidden">
      <div className="relative py-16 lg:py-24">
        <div className="text-center max-w-4xl mx-auto px-4 relative z-10">
          <span className="inline-block bg-green-100 text-green-700 font-semibold px-4 py-1.5 rounded-full text-sm mb-6 animate-fade-in-up">
            {t('hero.badge')}
          </span>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
            {t('hero.titlePart1')}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500 block sm:inline sm:ml-2">
              {t('hero.titlePart2')}
            </span>
          </h1>

          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            {t('hero.subtitle')}
          </p>

          <button
            onClick={() => navigate('/products')}
            className="px-8 py-4 bg-green-600 text-white font-bold rounded-full shadow-lg hover:bg-green-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            {t('hero.browse')}
          </button>
        </div>

        {/* Background Ambient Blobs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute top-10 left-1/4 w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
          <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
        </div>
      </div>
    </section>
  );
}
