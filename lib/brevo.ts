const BREVO_API_KEY = process.env.BREVO_API_KEY!;
const BASE = "https://api.brevo.com/v3";

export const BREVO_LISTS = {
  newsletter: 3,
  leads: 4,
  preorders: 5,
};

interface BrevoContact {
  email: string;
  listIds: number[];
  attributes?: Record<string, string>;
}

export async function addBrevoContact({ email, listIds, attributes }: BrevoContact) {
  if (!BREVO_API_KEY) return;

  await fetch(`${BASE}/contacts`, {
    method: "POST",
    headers: {
      "api-key": BREVO_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      listIds,
      attributes,
      updateEnabled: true,
    }),
  });
}
