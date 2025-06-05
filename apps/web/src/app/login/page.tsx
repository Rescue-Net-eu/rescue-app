'use client';
export const dynamic = 'force-dynamic';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
import api from '../../utils/api';

type FormData = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const { t } = useTranslation('common');
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    const res = await api('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const { access_token } = await res.json();
      const payload = JSON.parse(atob(access_token.split('.')[1]));
      localStorage.setItem('userId', payload.sub);
      document.cookie = `token=${access_token}; path=/`;
      router.push('/dashboard');
    } else {
      alert(t('login.error_invalid'));
    }
  };

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-2xl mb-4">{t('login.title')}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block mb-1">{t('login.email_placeholder')}</label>
          <input
            type="email"
            {...register('email', { required: true })}
            className="w-full border p-2"
          />
          {errors.email && <span className="text-red-500">*{t('common.required')}</span>}
        </div>
        <div>
          <label className="block mb-1">{t('login.password_placeholder')}</label>
          <input
            type="password"
            {...register('password', { required: true, minLength: 8 })}
            className="w-full border p-2"
          />
          {errors.password && (
            <span className="text-red-500">*{t('login.password_placeholder')} ≥ 8</span>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          {t('login.submit_button')}
        </button>
      </form>
    </main>
  );
}
