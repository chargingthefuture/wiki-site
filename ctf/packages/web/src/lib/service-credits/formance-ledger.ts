type FormanceTransactionResponse = {
  data?: {
    txid?: number | string;
    id?: number | string;
  };
  txid?: number | string;
  id?: number | string;
};

function getFormanceConfig() {
  const apiUrl = process.env.FORMANCE_API_URL?.trim();
  const ledger = process.env.FORMANCE_LEDGER?.trim();

  if (!apiUrl || !ledger) {
    throw new Error('external_ledger_not_configured');
  }

  return {
    apiUrl: apiUrl.replace(/\/$/, ''),
    ledger,
    apiToken: process.env.FORMANCE_API_TOKEN?.trim() ?? null,
    asset: process.env.FORMANCE_ASSET?.trim() || 'SERVICE_CREDITS',
  };
}

function toMinorUnits(amount: number): number {
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error('invalid_payload');
  }

  const minor = Math.round(amount * 100);
  if (minor <= 0) {
    throw new Error('invalid_payload');
  }

  return minor;
}

function readTransactionId(payload: FormanceTransactionResponse): string | null {
  const candidate = payload.data?.txid ?? payload.data?.id ?? payload.txid ?? payload.id;
  if (candidate === undefined || candidate === null) {
    return null;
  }

  return String(candidate);
}

export async function postEscrowHoldToFormance(input: {
  transferId: string;
  senderUserId: string;
  recipientUserId: string;
  amount: number;
  idempotencyKey: string;
}) {
  const config = getFormanceConfig();

  const response = await fetch(`${config.apiUrl}/api/ledger/${encodeURIComponent(config.ledger)}/transactions`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...(config.apiToken ? { authorization: `Bearer ${config.apiToken}` } : {}),
    },
    body: JSON.stringify({
      reference: `service-credits:${input.senderUserId}:${input.idempotencyKey}`,
      postings: [
        {
          source: `wallet:${input.senderUserId}`,
          destination: `escrow:${input.transferId}`,
          amount: toMinorUnits(input.amount),
          asset: config.asset,
        },
      ],
      metadata: {
        plugin: 'service-credits',
        transferId: input.transferId,
        recipientUserId: input.recipientUserId,
        flow: 'escrow_hold',
      },
    }),
  });

  if (!response.ok) {
    throw new Error('external_ledger_unavailable');
  }

  let payload: FormanceTransactionResponse = {};
  try {
    payload = (await response.json()) as FormanceTransactionResponse;
  } catch {
  }

  return {
    transactionId: readTransactionId(payload),
  };
}
