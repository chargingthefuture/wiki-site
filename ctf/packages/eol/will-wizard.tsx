import React, { useState } from 'react';

interface WillForm {
  fullName: string;
  assets: string;
  executor: string;
  beneficiaries: string;
  specialWishes: string;
}

const initialForm: WillForm = {
  fullName: '',
  assets: '',
  executor: '',
  beneficiaries: '',
  specialWishes: '',
};

export const WillWizard: React.FC<{ onComplete: (form: WillForm) => void }> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initialForm);

  const steps = [
    {
      label: 'Your Full Name',
      field: 'fullName',
      placeholder: 'Enter your legal name',
    },
    {
      label: 'Assets',
      field: 'assets',
      placeholder: 'List your assets (optional)',
    },
    {
      label: 'Executor',
      field: 'executor',
      placeholder: 'Who should carry out your wishes?',
    },
    {
      label: 'Beneficiaries',
      field: 'beneficiaries',
      placeholder: 'Who should receive your assets?',
    },
    {
      label: 'Special Wishes',
      field: 'specialWishes',
      placeholder: 'Any special instructions?',
    },
  ];

  const current = steps[step];


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const field = current.field as keyof WillForm;
    setForm({ ...form, [field]: e.target.value });
  };

  const next = () => setStep((s) => s + 1);
  const prev = () => setStep((s) => s - 1);

  if (step >= steps.length) {
    return (
      <div>
        <h3>Review Your Will</h3>
        <pre>{JSON.stringify(form, null, 2)}</pre>
        <button onClick={() => onComplete(form)}>Finish & Export</button>
        <button onClick={prev}>Back</button>
      </div>
    );
  }

  return (
    <div>
      <h3>{current.label}</h3>
      {current.field === 'specialWishes' ? (
        <textarea
          placeholder={current.placeholder}
          value={form[current.field as keyof WillForm]}
          onChange={handleChange}
        />
      ) : (
        <input
          type="text"
          placeholder={current.placeholder}
          value={form[current.field as keyof WillForm]}
          onChange={handleChange}
        />
      )}
      <div>
        {step > 0 && <button onClick={prev}>Back</button>}
        <button onClick={next}>Next</button>
      </div>
    </div>
  );
};
