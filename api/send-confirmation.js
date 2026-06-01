export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, phone, notes, experience, date, slot, persons, total, bookRef } = req.body;

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const FROM_EMAIL = process.env.FROM_EMAIL || 'onboarding@resend.dev';

  if (!RESEND_API_KEY) {
    return res.status(500).json({ error: 'RESEND_API_KEY not configured' });
  }

  const emailHtml = `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"/><style>body{background-color:#f4f4f4;margin:0;padding:0;font-family:Helvetica,Arial,sans-serif;}table{border-collapse:collapse;}p{margin:0;padding:0;}a{color:#33658A;}</style></head><body style="background-color:#f4f4f4;margin:0;padding:0;"><table border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td bgcolor="#33658A" align="center" style="padding:20px 12px 0px 12px;"><table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:652px;"><tr><td bgcolor="#ffffff" align="center" style="padding:24px 24px 0px 24px;border-radius:4px 4px 0px 0px;"><div style="margin-bottom:20px;display:inline-block;background:#33658A;border-radius:6px;padding:5px 14px;"><span style="color:#fff;font-size:15px;font-weight:700;font-family:monospace;">turneo</span></div><p style="font-size:18px;font-weight:600;margin:0 0 12px;color:#000;line-height:1.4;text-align:left;">Tienes una nueva reserva para ${experience.title} el ${date}.</p><p style="font-size:14px;color:#333;margin-bottom:8px;text-align:left;">Esta reserva está ahora confirmada, no se requiere ninguna acción adicional.</p><p style="font-size:14px;color:#333;margin-bottom:16px;text-align:left;">A continuación los detalles clave de la reserva.</p><div style="text-align:center;margin-bottom:24px;"><a href="https://app.turneo.co/organizer/bookings" style="display:inline-block;padding:8px 24px;background-color:#33658A;border-radius:50px;color:#fff;font-size:14px;font-weight:600;text-decoration:none;">Turneo Hub</a></div></td></tr></table></td></tr><tr><td bgcolor="#F3F3F3" align="center" style="padding:16px 12px 0px 12px;"><table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:652px;"><tr><td bgcolor="#fff" align="left" style="padding:16px 12px 24px 12px;border-radius:4px;font-size:14px;line-height:22px;"><h2 style="font-size:17px;font-weight:600;margin:0 0 4px;">${experience.title}</h2><p style="margin:0 0 12px;color:#555;">${experience.subtitle}</p><p style="margin-bottom:6px;"><span style="color:#33658A;">Fecha:</span> ${date}</p><p style="margin-bottom:6px;"><span style="color:#33658A;">Hora:</span> ${slot}</p><p style="margin-bottom:6px;"><span style="color:#33658A;">Punto de encuentro:</span> Concejo Hospedería, Valoria la Buena</p><p style="margin-bottom:6px;"><span style="color:#33658A;">Vendido por:</span> Concejo Hospedería</p><div style="background-color:#F2F2F2;padding:12px;margin-top:20px;margin-bottom:20px;border-radius:4px;"><p style="margin:0 0 8px;font-weight:600;">Información de pago</p><p style="margin-bottom:6px;"><span style="color:#33658A;">Pago gestionado por:</span> Turneo</p><p style="margin-bottom:6px;"><span style="color:#33658A;">Precio total:</span> €${total}</p><p style="margin-bottom:0;"><span style="color:#33658A;">Tus ingresos:</span> €${(parseFloat(total)*0.85).toFixed(2)}</p></div><p style="margin-top:24px;margin-bottom:8px;font-weight:600;">Información de la reserva:</p><p style="margin-bottom:6px;"><span style="color:#33658A;">Viajero principal:</span> ${name.toUpperCase()}</p>${phone ? `<p style="margin-bottom:6px;"><span style="color:#33658A;">Teléfono:</span> ${phone}</p>` : ''}<p style="margin-bottom:6px;"><span style="color:#33658A;">Booking ID:</span> ${bookRef}</p><p style="margin-bottom:6px;"><span style="color:#33658A;">Unidades:</span> ${persons} ${parseInt(persons)===1?'Adulto':'Adultos'}</p>${notes?`<p style="margin-bottom:6px;"><span style="color:#33658A;">Notas:</span> ${notes}</p>`:''}</td></tr></table></td></tr><tr><td bgcolor="#F3F3F3" align="center" style="padding:16px 12px 40px 12px;"><table width="100%" style="max-width:652px;margin:0 auto;"><tr><td align="center" style="padding:16px 12px;"><p style="margin:0;font-size:12px;color:#666;text-align:center;line-height:1.6;">¿Tienes alguna pregunta? Escríbenos a <a href="mailto:support@turneo.com">support@turneo.com</a>.<br/>Turneo Ltd is registered in the UK at 71-75 Shelton Street, London, WC2H 9JQ, UK</p></td></tr></table></td></tr></table></body></html>`;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `Concejo Hospedería Experiencias <${FROM_EMAIL}>`,
        to: [email],
        subject: `Confirmado: Nueva reserva para ${experience.title} el ${date} — ${bookRef}`,
        html: emailHtml,
      }),
    });

    const data = await response.json();
    if (!response.ok) return res.status(500).json({ error: data.message || 'Error sending email' });
    return res.status(200).json({ success: true, id: data.id });
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}
