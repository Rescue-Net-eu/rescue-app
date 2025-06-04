'use client';
export const dynamic = 'force-dynamic';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'next-i18next';

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  city: string;
};

export default function VolunteerSignupPage(props: any) {
  const { params } = props;
  const router = useRouter();
  const { token } = params as { token: string };
  const { t } = useTranslation('common');
  const [valid, setValid] = useState<boolean | null>(null);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  useEffect(() => {
    fetch(`/api/invitations/validate?token=${token}`)
      .then(res => res.json())
      .then(data => setValid(data.valid))
      .catch(() => setValid(false));
  }, [token]);

  const onSubmit = async (data: FormData) => {
    const res = await fetch('/api/auth/signup/volunteer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, ...data }),
    });
    if (res.ok) router.push('/signup/success');
    else alert('Signup failed');
  };

  if (valid === null) return <p>{t('common.loading')}</p>;
  if (!valid) return <p>{t('signup.invalid_token')}</p>;

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
