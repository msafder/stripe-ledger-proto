export const dynamic = "force-dynamic";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://api:3000";


async function getJson(path: string) {
  const url = `${API_BASE}${path}`;
  const r = await fetch(url, { cache: "no-store" });

  const text = await r.text();
  if (!r.ok) throw new Error(`${path} failed: ${r.status} ${text}`);
  return JSON.parse(text);
}

function truncateMiddle(value: string, start = 10, end = 6) {
  if (value.length <= start + end + 3) return value;
  return `${value.slice(0, start)}…${value.slice(-end)}`;
}

function formatCents(centsStr: string, currency: string) {
  const cents = Number(centsStr);
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(cents / 100);
}

const COL = {
  time: 210,
  account: 160,
  currency: 70,
  amount: 60,
} as const;

const td = { padding: "6px 12px", verticalAlign: "top" as const };
const th = { padding: "8px 12px", verticalAlign: "bottom" as const };

export default async function AdminPage() {
  const [balances, entries] = await Promise.all([
    getJson("/ledger/balances"),
    getJson("/ledger/entries?take=50"),
  ]);

  return (
    <main>
      <h1>Admin</h1>
      <p>Balances and latest ledger entries from Postgres.</p>

      <h2>Balances</h2>
      <div style={{ border: "1px solid #ddd", borderRadius: 12, padding: 12, overflowX: "hidden" }}>
        {Array.isArray(balances) && balances.length ? (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th align="left">Account</th>
                <th align="left">Currency</th>
                <th align="right">Balance</th>
              </tr>
            </thead>
            <tbody>
              {balances.map((b: any) => (
                <tr key={`${b.accountCode}-${b.currency}`}>
                  <td style={{ padding: "6px 0" }}><code>{b.accountCode}</code></td>
                  <td style={{ padding: "6px 0" }}><code>{b.currency}</code></td>
                  <td style={{ padding: "6px 0" }} align="right">
                    {formatCents(b.balanceCents, b.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p><em>No balances yet.</em></p>
        )}
      </div>

      <h2 style={{ marginTop: 24 }}>Latest Entries</h2>
      <div style={{ border: "1px solid #ddd", borderRadius: 12, padding: 12 }}>
        {Array.isArray(entries) && entries.length ? (
          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
            <thead>
              <tr>
                <th align="left"  style={{ ...th, width: COL.time, whiteSpace: "nowrap" }}>Time</th>
                <th align="left"  style={{ ...th, width: COL.account, whiteSpace: "nowrap" }}>Account</th>
                <th align="left"  style={{ ...th, width: COL.currency, whiteSpace: "nowrap" }}>Currency</th>
                <th align="right" style={{ ...th, width: COL.amount, whiteSpace: "nowrap" }}>Amount</th>
                <th align="left" style={th}>Description</th>
              </tr>
            </thead>

            <tbody>
              {entries.map((e: any) => (
                <tr key={e.id}>
                  <td style={{ ...td, width: COL.time, whiteSpace: "nowrap" }}>
                    <code>{new Date(e.occurredAt).toLocaleString()}</code>
                  </td>

                  <td style={{ ...td, width: COL.account, whiteSpace: "nowrap" }}>
                    <code>{e.accountCode}</code>
                  </td>

                  <td style={{ ...td, width: COL.currency, whiteSpace: "nowrap" }}>
                    <code>{e.currency}</code>
                  </td>

                  <td align="right" style={{ ...td, width: COL.amount, whiteSpace: "nowrap" }}>
                    {formatCents(e.amountCents, e.currency)}
                  </td>

                  <td
                    style={{
                      ...td,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      fontFamily: "monospace",
                      fontSize: 13,
                      color: "#333",
                    }}
                    title={e.description ?? ""}
                  >
                    {e.description ? truncateMiddle(e.description) : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p><em>No entries yet.</em></p>
        )}
      </div>

      <p style={{ marginTop: 24 }}>
        <a href="/pricing">Back to pricing</a>
      </p>
    </main>
  );
}
