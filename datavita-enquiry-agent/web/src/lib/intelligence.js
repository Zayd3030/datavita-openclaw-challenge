export async function fetchIntelligenceContext(qualificationData) {
  const response = await fetch('/api/intelligence', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ qualificationData }),
  });

  if (!response.ok) {
    throw new Error(`Intelligence fetch failed: ${response.status}`);
  }

  return response.json();
}
