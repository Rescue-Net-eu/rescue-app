'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'next-i18next';

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  city: string;
  country: string;
  specialization: string;
  certifications?: string[];
  transportModes?: string[];
  equipment?: string[];
};

export default function DirectSignupPage() {
  const router = useRouter();
  const { t } = useTranslation('common');
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    const res = await fetch('/api/auth/signup/direct', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) router.push('/signup/success');
    else alert('Signup failed');
  };

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-2xl mb-4">{t('signup.title')}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block mb-1">{t('signup.first_name_label')}</label>
          <input
            {...register('firstName', { required: true })}
            className="w-full border p-2"
          />
          {errors.firstName && <span className="text-red-500">*{t('common.required')}</span>}
        </div>
        <div>
          <label className="block mb-1">{t('signup.last_name_label')}</label>
          <input
            {...register('lastName', { required: true })}
            className="w-full border p-2"
          />
          {errors.lastName && <span className="text-red-500">*{t('common.required')}</span>}
        </div>
        <div>
          <label className="block mb-1">{t('signup.email_label')}</label>
          <input
            type="email"
            {...register('email', { required: true })}
            className="w-full border p-2"
          />
          {errors.email && <span className="text-red-500">*{t('common.required')}</span>}
        </div>
        <div>
          <label className="block mb-1">{t('signup.age_label')}</label>
          <input
            type="number"
            {...register('age', { required: true, min: 16 })}
            className="w-full border p-2"
          />
          {errors.age && <span className="text-red-500">*{t('signup.age_label')} ≥ 16</span>}
        </div>
        <div>
          <label className="block mb-1">{t('signup.city_label')}</label>
          <input
            {...register('city', { required: true })}
            className="w-full border p-2"
          />
          {errors.city && <span className="text-red-500">*{t('common.required')}</span>}
        </div>
        <div>
          <label className="block mb-1">{t('signup.country_label')}</label>
          <input
            {...register('country', { required: true })}
            className="w-full border p-2"
          />
          {errors.country && <span className="text-red-500">*{t('common.required')}</span>}
        </div>
        <div>
          <label className="block mb-1">{t('signup.specialization_label')}</label>
          <input
            {...register('specialization', { required: true })}
            className="w-full border p-2"
          />
          {errors.specialization && <span className="text-red-500">*{t('common.required')}</span>}
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          {t('signup.submit_button')}
        </button>
      </form>
    </main>
  );
}
