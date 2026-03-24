'use client';

import { useMemo, useState } from 'react';

type EnrollModalProps = {
  cohortId: string;
  requiredCredits: number;
  allowNoDeposit: boolean;
};

export function EnrollModal({ cohortId, requiredCredits, allowNoDeposit }: EnrollModalProps) {
  const [open, setOpen] = useState(false);
  const [depositCredits, setDepositCredits] = useState(requiredCredits);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const escrowPreview = useMemo(() => {
    if (depositCredits <= 0) {
      return 'No escrow deposit will be locked for this enrollment.';
    }

    return `${depositCredits.toFixed(2)} ServiceCredits will be held in milestone escrows.`;
  }, [depositCredits]);

  async function onEnroll() {
    setPending(true);
    setMessage(null);

    try {
      const response = await fetch('/api/levelup/enroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-ctf-csrf': '1',
        },
        body: JSON.stringify({
          cohortId,
          depositCredits,
          allowWithoutDeposit: allowNoDeposit && depositCredits <= 0,
          idempotencyKey: `enroll:${cohortId}:${Date.now()}`,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setMessage(data.message ?? 'Enrollment failed.');
        return;
      }

      setMessage(`Enrollment created: ${data.enrollment.enrollmentId}`);
    } catch {
      setMessage('Enrollment request failed.');
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-2">
      <button type="button" onClick={() => setOpen((prev) => !prev)} className="rounded bg-blue-600 px-3 py-2 text-white text-sm">
        {open ? 'Close enroll panel' : 'Enroll'}
      </button>

      {open ? (
        <div className="rounded border p-3 text-sm space-y-2">
          <label className="block">
            <span className="block font-medium">Deposit credits</span>
            <input
              type="number"
              min={allowNoDeposit ? 0 : requiredCredits}
              step="0.01"
              value={depositCredits}
              onChange={(event) => setDepositCredits(Number(event.target.value))}
              className="w-full rounded border px-2 py-1"
            />
          </label>

          <p className="text-muted-foreground">{escrowPreview}</p>

          <button type="button" onClick={onEnroll} disabled={pending} className="rounded border px-3 py-1">
            {pending ? 'Submitting...' : 'Confirm enrollment'}
          </button>

          {message ? <p className="text-muted-foreground">{message}</p> : null}
        </div>
      ) : null}
    </div>
  );
}
