import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const FONNTE_TOKEN = (Deno.env.get("FONNTE_TOKEN") ?? "").trim();
const ADMIN_PHONE = (Deno.env.get("ADMIN_PHONE") ?? "").trim();

serve(async (req) => {
  try {
    if (!FONNTE_TOKEN || !ADMIN_PHONE) {
      return new Response(
        JSON.stringify({ success: false, error: "Konfigurasi server belum lengkap." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const payload = await req.json();
    const record = payload.record; // baris baru dari tabel messages

    const text =
      `📩 *Pesan Baru dari Portofolio!*\n\n` +
      `*Nama:* ${record.name}\n` +
      `*Email:* ${record.email}\n` +
      `*Subjek:* ${record.subject}\n\n` +
      `*Pesan:*\n${record.message}`;

    const fonnteRes = await fetch("https://api.fonnte.com/send", {
      method: "POST",
      headers: {
        Authorization: FONNTE_TOKEN,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        target: ADMIN_PHONE,
        message: text,
      }),
    });

    const result = await fonnteRes.json();

    return new Response(JSON.stringify({ success: true, result }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ success: false, error: String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});