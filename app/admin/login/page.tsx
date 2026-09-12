'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

export default function AdminLoginPage() {
  const router = useRouter();
  const { t } = useTranslation('admin');

  const [step, setStep] = useState<'login' | 'verify'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Login step
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userId, setUserId] = useState<number | null>(null);

  // Verify step
  const [code, setCode] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorKey = data.error || 'somethingWrong';
        setError(t(`auth.errors.${errorKey}`));
        return;
      }

      if (data.requiresTwoFactor) {
        setUserId(data.userId);
        setStep('verify');
      }
    } catch (err) {
      setError(t('auth.errors.somethingWrong'));
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/admin/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, code }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorKey = data.error || 'somethingWrong';
        setError(t(`auth.errors.${errorKey}`));
        return;
      }

      // Успешная аутентификация - перенаправить в админку
      router.push('/admin');
    } catch (err) {
      setError(t('auth.errors.somethingWrong'));
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setError('');
        // Показать уведомление об успешной отправке
        alert(t('auth.twoFactor.codeResent'));
      } else {
        const errorKey = data.error || 'somethingWrong';
        setError(t(`auth.errors.${errorKey}`));
      }
    } catch (err) {
      setError(t('auth.errors.somethingWrong'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">A-Frame Admin</h1>
          <p className="text-slate-400">
            {step === 'login'
              ? t('auth.login.subtitle')
              : t('auth.twoFactor.subtitle')}
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-slate-700">
          {step === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-6">
              <h2 className="text-2xl font-semibold text-white text-center mb-6">
                {t('auth.login.title')}
              </h2>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  {t('auth.login.email')}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('auth.login.emailPlaceholder')}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  required
                  disabled={loading}
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  {t('auth.login.password')}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('auth.login.passwordPlaceholder')}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  required
                  disabled={loading}
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {loading ? t('auth.login.loggingIn') : t('auth.login.loginButton')}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="space-y-6">
              <h2 className="text-2xl font-semibold text-white text-center mb-6">
                {t('auth.twoFactor.title')}
              </h2>

              {/* Verification Code */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2 text-center">
                  {t('auth.twoFactor.subtitle')}
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder={t('auth.twoFactor.codePlaceholder')}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white text-center text-2xl tracking-widest placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  required
                  disabled={loading}
                  maxLength={6}
                  pattern="\d{6}"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || code.length !== 6}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {loading ? t('auth.twoFactor.verifying') : t('auth.twoFactor.verifyButton')}
              </button>

              {/* Resend Code */}
              <button
                type="button"
                onClick={handleResendCode}
                disabled={loading}
                className="w-full text-slate-400 hover:text-white font-medium py-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('auth.twoFactor.resendCode')}
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-slate-500 text-sm">
            © 2024 A-Frame KG. Все права защищены.
          </p>
        </div>
      </div>
    </div>
  );
}
