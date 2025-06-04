import { useTranslation } from 'next-i18next';

export default function SignupSuccessPage() {
  const { t } = useTranslation('common');
  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-2xl">{t('signup.success_message')}</h1>
    </main>
  );
}
