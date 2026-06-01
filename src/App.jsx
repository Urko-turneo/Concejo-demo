import { useState } from "react";

const WINE = "#6B1E3A";
const TERRA = "#A84448";
const GOLD = "#C4933F";
const CREAM = "#F5EFE0";
const DARK = "#2D2420";
const SAND = "#E8DCC8";
const TURNEO_BLUE = "#33658A";

const experiences = [
  { id: 1, title: "Visita a Bodega + Cata Guiada", subtitle: "Experiencia Concejo", duration: "2h", persons: "2–12 personas", price: 28, description: "Recorre nuestra bodega familiar, conoce el proceso de elaboración del vino Cigales y disfruta de una cata comentada de 4 referencias con maridaje de productos locales.", tags: ["Enoturismo", "Grupos", "Todo el año"], slots: ["11:00", "13:00", "17:00", "19:00"], image: "🍷", color: WINE },
  { id: 2, title: "Cata Premium en el Salón de los Relojes", subtitle: "Experiencia Exclusiva", duration: "1h 30min", persons: "2–8 personas", price: 45, description: "Cata vertical de nuestras mejores añadas en el emblemático salón histórico del palacio, con maridaje de quesos artesanos de Castilla y León y charcutería ibérica.", tags: ["Premium", "Romántico", "Privado"], slots: ["19:00", "20:30"], image: "🏛️", color: TERRA },
  { id: 3, title: "Ruta por los Viñedos al Amanecer", subtitle: "Experiencia Natural", duration: "3h", persons: "2–6 personas", price: 35, description: "Paseo guiado por las viñas ecológicas de la Finca Carredueñas al amanecer, con explicación de la viticultura de Cigales y picoteo de temporada al aire libre.", tags: ["Naturaleza", "Madrugadores", "Primavera-Otoño"], slots: ["07:30", "08:30"], image: "🌅", color: "#5A7A3A" },
  { id: 4, title: "Senderismo por el Cerrato Palentino", subtitle: "Actividad Externa — Guía Local", duration: "4h", persons: "2–10 personas", price: 22, description: "Ruta de senderismo por el impresionante Cerrato Palentino con guía local. Paisajes únicos de la meseta castellana, flora autóctona y parajes de interés etnográfico.", tags: ["Senderismo", "Naturaleza", "Externo"], slots: ["09:00", "10:00"], image: "🥾", color: "#3A5A4A" },
  { id: 5, title: "Vuelo en Parapente sobre Cigales", subtitle: "Actividad Externa — Escuela Certificada", duration: "2h", persons: "1–4 personas", price: 89, description: "Experiencia única sobrevolando los viñedos de la D.O. Cigales con instructor certificado. Incluye traslado desde la hospedería y fotos del vuelo.", tags: ["Adrenalina", "Vistas", "Externo"], slots: ["10:00", "12:00", "16:00"], image: "🪂", color: "#2A4A7A" },
  { id: 6, title: "Apiturismo: Mundo de las Abejas", subtitle: "Actividad Externa — Apicultor Local", duration: "2h", persons: "2–8 personas", price: 30, description: "Visita a las colmenas del entorno con apicultor local. Conoce la producción de miel artesanal de la meseta y cata de variedades con pan de masa madre.", tags: ["Familia", "Artesano", "Externo"], slots: ["10:30", "16:30"], image: "🐝", color: "#7A5A10" },
];

const today = new Date();
const getNextDays = (n) => Array.from({ length: n }, (_, i) => { const d = new Date(today); d.setDate(today.getDate() + i); return d; });
const days = getNextDays(7);
const fmtDate = (d) => d.toLocaleDateString("es-ES", { day: "2-digit", month: "long", year: "numeric" });
const fmtDateShort = (d) => d.toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" });
const steps = ["Elige experiencia", "Fecha y hora", "Reserva"];
const categories = ["Todos", "Enoturismo", "Naturaleza", "Adrenalina", "Familia"];

// ── Pantalla de confirmación (replica email Turneo) ──
function ConfirmationScreen({ exp, form, date, slot, persons, total, bookRef, onReset, emailSent }) {
  return (
    <div style={{ background: "#F4F4F4", minHeight: "100vh", padding: 0 }}>
      {/* Barra simulando cliente de email */}
      <div style={{ background: "#2D2D2D", padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          {["#FF5F57","#FFBD2E","#27C93F"].map(c => <div key={c} style={{ width: 12, height: 12, borderRadius: "50%", background: c }} />)}
        </div>
        <div style={{ background: "#3D3D3D", borderRadius: 6, padding: "4px 80px", fontSize: 11, color: "#aaa", fontFamily: "monospace" }}>Bandeja de entrada</div>
        <div style={{ fontSize: 11, color: "#666", fontFamily: "Trebuchet MS,sans-serif" }}>
          {emailSent ? "✅ Email enviado" : "Vista previa del email"}
        </div>
      </div>

      {/* Cabecera del mensaje */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e0e0e0", padding: "12px 16px" }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#333", fontFamily: "Trebuchet MS,sans-serif", marginBottom: 4 }}>
          ✅ Confirmado: Nueva reserva para {exp.title} el {fmtDateShort(days[date])} — {bookRef}
        </div>
        <div style={{ fontSize: 12, color: "#888", fontFamily: "Trebuchet MS,sans-serif" }}>
          De: <span style={{ color: TURNEO_BLUE }}>Concejo Hospedería Experiencias &lt;bookings@turneo.com&gt;</span>
          {" · "} Para: <span style={{ color: "#333" }}>{form.email}</span>
          {emailSent && <span style={{ marginLeft: 8, color: "#2E7D4F", fontWeight: 600 }}>· Enviado correctamente ✓</span>}
        </div>
      </div>

      {/* Cuerpo del email */}
      <div style={{ padding: "0 0 60px" }}>
        <table role="presentation" border="0" cellPadding="0" cellSpacing="0" width="100%">
          <tr>
            <td style={{ backgroundColor: TURNEO_BLUE, padding: "20px 12px 0px" }}>
              <table role="presentation" width="100%" style={{ maxWidth: 652, margin: "0 auto" }}>
                <tr>
                  <td style={{ backgroundColor: "#fff", padding: "24px 24px 0px", borderRadius: "4px 4px 0 0", fontFamily: "'Source Sans Pro',Helvetica,Arial,sans-serif", textAlign: "center" }}>
                    <div style={{ marginBottom: 20, display: "inline-flex", alignItems: "center", gap: 8 }}>
                      <div style={{ background: TURNEO_BLUE, borderRadius: 6, padding: "5px 14px" }}>
                        <span style={{ color: "#fff", fontSize: 15, fontWeight: 700, fontFamily: "monospace" }}>turneo</span>
                      </div>
                    </div>
                    <p style={{ fontSize: 18, fontWeight: 600, margin: "0 0 12px", color: "#000", lineHeight: 1.4, textAlign: "left" }}>
                      Tienes una nueva reserva para {exp.title} el {fmtDateShort(days[date])}.
                    </p>
                    <p style={{ fontSize: 14, color: "#333", marginBottom: 8, textAlign: "left" }}>Esta reserva está ahora confirmada, no se requiere ninguna acción adicional.</p>
                    <p style={{ fontSize: 14, color: "#333", marginBottom: 16, textAlign: "left" }}>A continuación los detalles clave de la reserva. Puedes ver toda la información en tu Turneo Hub.</p>
                    <div style={{ textAlign: "center", marginBottom: 24 }}>
                      <span style={{ display: "inline-block", padding: "8px 24px", backgroundColor: TURNEO_BLUE, borderRadius: 50, color: "#fff", fontSize: 14, fontWeight: 600, fontFamily: "Trebuchet MS,sans-serif" }}>Turneo Hub</span>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr><td style={{ backgroundColor: "#f4f4f4", padding: "0 12px" }}>
            <table width="100%" style={{ maxWidth: 652, margin: "0 auto" }}>
              <tr><td style={{ backgroundColor: "#fff", padding: 12, borderRadius: "0 0 4px 4px" }}></td></tr>
            </table>
          </td></tr>

          <tr>
            <td style={{ backgroundColor: "#F3F3F3", padding: "16px 12px 0" }}>
              <table role="presentation" width="100%" style={{ maxWidth: 652, margin: "0 auto" }}>
                <tr>
                  <td style={{ backgroundColor: "#fff", padding: "16px 12px 24px", borderRadius: 4, fontFamily: "'Source Sans Pro',Helvetica,Arial,sans-serif", fontSize: 14, lineHeight: "22px" }}>
                    <h2 style={{ fontSize: 17, fontWeight: 600, margin: "0 0 4px" }}>{exp.title}</h2>
                    <p style={{ margin: "0 0 12px", color: "#555" }}>{exp.subtitle}</p>
                    <div style={{ width: "100%", height: 72, background: exp.color, borderRadius: 8, marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32 }}>{exp.image}</div>
                    <p style={{ marginBottom: 6 }}><span style={{ color: TURNEO_BLUE }}>Fecha:</span> {fmtDateShort(days[date])}</p>
                    <p style={{ marginBottom: 6 }}><span style={{ color: TURNEO_BLUE }}>Hora:</span> {slot}</p>
                    <p style={{ marginBottom: 6 }}><span style={{ color: TURNEO_BLUE }}>Punto de encuentro:</span> Concejo Hospedería, Valoria la Buena</p>
                    <p style={{ marginBottom: 6 }}><span style={{ color: TURNEO_BLUE }}>Vendido por:</span> Concejo Hospedería</p>

                    <div style={{ backgroundColor: "#F2F2F2", padding: 12, marginTop: 20, marginBottom: 20, borderRadius: 4 }}>
                      <p style={{ margin: "0 0 8px", fontWeight: 600 }}>Información de pago</p>
                      <p style={{ marginBottom: 6 }}><span style={{ color: TURNEO_BLUE }}>Pago gestionado por:</span> Turneo</p>
                      <p style={{ marginBottom: 6 }}><span style={{ color: TURNEO_BLUE }}>Precio total:</span> €{total.toFixed(2)}</p>
                      <p style={{ marginBottom: 0 }}><span style={{ color: TURNEO_BLUE }}>Tus ingresos:</span> €{(total * 0.85).toFixed(2)}</p>
                    </div>

                    <p style={{ marginTop: 24, marginBottom: 8, fontWeight: 600 }}>Información de la reserva:</p>
                    <p style={{ marginBottom: 6 }}><span style={{ color: TURNEO_BLUE }}>Viajero principal:</span> {form.name.toUpperCase()}</p>
                    {form.phone && <p style={{ marginBottom: 6 }}><span style={{ color: TURNEO_BLUE }}>Teléfono:</span> {form.phone}</p>}
                    <p style={{ marginBottom: 6 }}><span style={{ color: TURNEO_BLUE }}>Booking ID:</span> {bookRef}</p>
                    <p style={{ marginBottom: 6 }}><span style={{ color: TURNEO_BLUE }}>Unidades:</span> {persons} {persons === 1 ? "Adulto" : "Adultos"}</p>
                    {form.notes && <p style={{ marginBottom: 6 }}><span style={{ color: TURNEO_BLUE }}>Notas:</span> {form.notes}</p>}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style={{ backgroundColor: "#F3F3F3", padding: "16px 12px 40px" }}>
              <table width="100%" style={{ maxWidth: 652, margin: "0 auto" }}>
                <tr>
                  <td style={{ padding: "16px 12px", textAlign: "center", fontFamily: "'Source Sans Pro',Helvetica,Arial,sans-serif" }}>
                    <p style={{ margin: 0, fontSize: 12, color: "#666", lineHeight: 1.6 }}>
                      ¿Tienes alguna pregunta? Escríbenos a <a href="mailto:support@turneo.com" style={{ color: TURNEO_BLUE }}>support@turneo.com</a>.<br />
                      Turneo Ltd is registered in the UK at 71-75 Shelton Street, London, WC2H 9JQ, UK
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </div>

      <div style={{ position: "fixed", bottom: 20, right: 20 }}>
        <button onClick={onReset} style={{ background: WINE, color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", fontFamily: "Georgia,serif", fontSize: 13, cursor: "pointer", boxShadow: "0 4px 12px rgba(107,30,58,0.3)" }}>
          ← Hacer otra reserva
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState(null);
  const [date, setDate] = useState(null);
  const [slot, setSlot] = useState(null);
  const [persons, setPersons] = useState(2);
  const [form, setForm] = useState({ name: "", email: "", phone: "", notes: "" });
  const [confirmed, setConfirmed] = useState(false);
  const [filter, setFilter] = useState("Todos");
  const [sending, setSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [sendError, setSendError] = useState(null);
  const [bookRef] = useState("CJ-" + Math.floor(Math.random() * 9000 + 1000));

  const filtered = filter === "Todos" ? experiences : experiences.filter(e => e.tags.some(t => t === filter));
  const exp = experiences.find(e => e.id === selected);
  const total = exp ? exp.price * persons : 0;
  const canProceed = (step === 0 && selected) || (step === 1 && date !== null && slot) || step === 2;

  async function handleSubmit() {
    if (!form.name || !form.email) return;
    setSending(true);
    setSendError(null);

    try {
      const res = await fetch("/api/send-confirmation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          notes: form.notes,
          experience: { title: exp.title, subtitle: exp.subtitle, image: exp.image, color: exp.color },
          date: fmtDate(days[date]),
          slot,
          persons,
          total: total.toFixed(2),
          bookRef,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setEmailSent(true);
      } else {
        setSendError(data.error || "Error al enviar el email. La reserva está confirmada.");
      }
    } catch (err) {
      setSendError("No se pudo conectar con el servidor de email. La reserva está confirmada.");
    } finally {
      setSending(false);
      setConfirmed(true);
    }
  }

  function handleReset() {
    setConfirmed(false); setStep(0); setSelected(null);
    setDate(null); setSlot(null); setPersons(2);
    setForm({ name: "", email: "", phone: "", notes: "" });
    setEmailSent(false); setSendError(null);
  }

  if (confirmed) return (
    <ConfirmationScreen exp={exp} form={form} date={date} slot={slot} persons={persons}
      total={total} bookRef={bookRef} onReset={handleReset} emailSent={emailSent} />
  );

  return (
    <div style={{ fontFamily: "'Georgia', serif", background: CREAM, minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ background: WINE, padding: "0.875rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 20 }}>🍷</span>
          <div>
            <div style={{ color: GOLD, fontWeight: 700, fontSize: 14, letterSpacing: 1.5, fontFamily: "Trebuchet MS,sans-serif" }}>CONCEJO HOSPEDERÍA</div>
            <div style={{ color: "#D4B8C0", fontSize: 10, fontFamily: "Trebuchet MS,sans-serif" }}>Valoria la Buena · D.O. Cigales · Posada Real 4★</div>
          </div>
        </div>
        <div style={{ color: "#D4B8C0", fontSize: 11, display: "flex", gap: 14, fontFamily: "Trebuchet MS,sans-serif" }}>
          {["Hotel", "Restaurante", "Bodas", "Vino"].map(n => <span key={n}>{n}</span>)}
          <span style={{ color: GOLD, fontWeight: 600 }}>Experiencias</span>
        </div>
      </div>

      {/* Hero */}
      <div style={{ background: `linear-gradient(135deg,${WINE},#4A1228)`, padding: "2rem 1.5rem 1.75rem", color: "#fff" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div style={{ fontSize: 10, color: GOLD, letterSpacing: 3, fontFamily: "Trebuchet MS,sans-serif", marginBottom: 6 }}>RESERVA DE EXPERIENCIAS</div>
          <h1 style={{ fontSize: 26, fontWeight: 400, margin: "0 0 0.4rem", lineHeight: 1.2 }}>Vive el vino de Cigales</h1>
          <p style={{ color: "#D4B8C0", fontSize: 13, margin: 0, fontFamily: "Trebuchet MS,sans-serif" }}>Catas, visitas a bodega, senderismo y actividades únicas en el corazón de Castilla</p>
        </div>
      </div>

      {/* Stepper */}
      <div style={{ background: "#fff", borderBottom: `1px solid ${SAND}`, padding: "0 1.5rem" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", display: "flex" }}>
          {steps.map((s, i) => (
            <div key={s} style={{ flex: 1, padding: "0.875rem 0", textAlign: "center", borderBottom: `3px solid ${i === step ? WINE : i < step ? GOLD : "transparent"}`, cursor: i < step ? "pointer" : "default" }} onClick={() => i < step && setStep(i)}>
              <div style={{ fontSize: 11, color: i === step ? WINE : i < step ? GOLD : "#bbb", fontFamily: "Trebuchet MS,sans-serif", fontWeight: i <= step ? 600 : 400 }}>{i + 1}. {s}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "1.25rem 1.5rem 3rem" }}>

        {/* STEP 0 */}
        {step === 0 && (
          <div>
            <div style={{ display: "flex", gap: 8, marginBottom: "1.25rem", flexWrap: "wrap" }}>
              {categories.map(c => (
                <button key={c} onClick={() => setFilter(c)} style={{ padding: "5px 14px", borderRadius: 20, border: `1.5px solid ${filter === c ? WINE : SAND}`, background: filter === c ? WINE : "#fff", color: filter === c ? "#fff" : DARK, fontSize: 12, fontFamily: "Trebuchet MS,sans-serif", cursor: "pointer" }}>{c}</button>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "0.875rem" }}>
              {filtered.map(ex => (
                <div key={ex.id} onClick={() => setSelected(ex.id)} style={{ background: "#fff", borderRadius: 12, overflow: "hidden", border: `2px solid ${selected === ex.id ? WINE : SAND}`, cursor: "pointer", boxShadow: selected === ex.id ? `0 4px 20px rgba(107,30,58,0.18)` : "0 1px 6px rgba(0,0,0,0.06)", transform: selected === ex.id ? "translateY(-2px)" : "none", transition: "all 0.15s" }}>
                  <div style={{ background: ex.color, padding: "1rem 1.125rem", display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 28 }}>{ex.image}</span>
                    <div>
                      <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 9, letterSpacing: 2, fontFamily: "Trebuchet MS,sans-serif", textTransform: "uppercase" }}>{ex.subtitle}</div>
                      <div style={{ color: "#fff", fontWeight: 600, fontSize: 14, lineHeight: 1.3 }}>{ex.title}</div>
                    </div>
                  </div>
                  <div style={{ padding: "0.875rem 1.125rem" }}>
                    <p style={{ color: "#555", fontSize: 12, lineHeight: 1.6, margin: "0 0 0.625rem" }}>{ex.description}</p>
                    <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: "0.625rem" }}>
                      {ex.tags.map(t => <span key={t} style={{ background: CREAM, color: TERRA, fontSize: 10, padding: "2px 7px", borderRadius: 10, fontFamily: "Trebuchet MS,sans-serif", border: `1px solid ${SAND}` }}>{t}</span>)}
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid ${SAND}`, paddingTop: "0.625rem" }}>
                      <span style={{ fontSize: 10, color: "#999", fontFamily: "Trebuchet MS,sans-serif" }}>⏱ {ex.duration} · {ex.persons}</span>
                      <div><span style={{ fontSize: 20, fontWeight: 700, color: WINE }}>{ex.price}€</span><span style={{ fontSize: 10, color: "#999", fontFamily: "Trebuchet MS,sans-serif" }}>/persona</span></div>
                    </div>
                  </div>
                  {selected === ex.id && <div style={{ background: WINE, padding: "0.4rem", textAlign: "center", color: "#fff", fontSize: 11, fontFamily: "Trebuchet MS,sans-serif" }}>✓ Seleccionada</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 1 */}
        {step === 1 && exp && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: "1.25rem" }}>
            <div>
              <div style={{ background: "#fff", borderRadius: 12, border: `1px solid ${SAND}`, overflow: "hidden", marginBottom: "1.25rem" }}>
                <div style={{ background: exp.color, padding: "0.875rem 1.125rem", display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 24 }}>{exp.image}</span>
                  <div><div style={{ color: "rgba(255,255,255,0.7)", fontSize: 9, letterSpacing: 2, fontFamily: "Trebuchet MS,sans-serif" }}>{exp.subtitle}</div><div style={{ color: "#fff", fontWeight: 600, fontSize: 15 }}>{exp.title}</div></div>
                </div>
              </div>
              <div style={{ background: "#fff", borderRadius: 12, border: `1px solid ${SAND}`, padding: "1.125rem", marginBottom: "1.125rem" }}>
                <div style={{ fontFamily: "Trebuchet MS,sans-serif", fontWeight: 600, fontSize: 12, color: WINE, letterSpacing: 1, textTransform: "uppercase", marginBottom: "0.875rem" }}>Número de personas</div>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <button onClick={() => setPersons(Math.max(1, persons - 1))} style={{ width: 34, height: 34, borderRadius: "50%", border: `1.5px solid ${SAND}`, background: "#fff", fontSize: 18, cursor: "pointer", color: WINE }}>−</button>
                  <span style={{ fontSize: 22, fontWeight: 700, color: DARK, minWidth: 24, textAlign: "center" }}>{persons}</span>
                  <button onClick={() => setPersons(Math.min(12, persons + 1))} style={{ width: 34, height: 34, borderRadius: "50%", border: `1.5px solid ${WINE}`, background: WINE, fontSize: 18, cursor: "pointer", color: "#fff" }}>+</button>
                  <span style={{ color: "#999", fontSize: 12, fontFamily: "Trebuchet MS,sans-serif" }}>{exp.price}€/persona</span>
                </div>
              </div>
              <div style={{ background: "#fff", borderRadius: 12, border: `1px solid ${SAND}`, padding: "1.125rem", marginBottom: "1.125rem" }}>
                <div style={{ fontFamily: "Trebuchet MS,sans-serif", fontWeight: 600, fontSize: 12, color: WINE, letterSpacing: 1, textTransform: "uppercase", marginBottom: "0.875rem" }}>Selecciona fecha</div>
                <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
                  {days.map((d, i) => (
                    <button key={i} onClick={() => { setDate(i); setSlot(null); }} style={{ padding: "7px 12px", borderRadius: 10, border: `1.5px solid ${date === i ? WINE : SAND}`, background: date === i ? WINE : "#fff", color: date === i ? "#fff" : DARK, fontSize: 12, fontFamily: "Trebuchet MS,sans-serif", cursor: "pointer", textAlign: "center", minWidth: 62 }}>
                      <div style={{ fontSize: 9, opacity: 0.8 }}>{d.toLocaleDateString("es-ES", { weekday: "short" }).toUpperCase()}</div>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{d.getDate()}</div>
                      <div style={{ fontSize: 9, opacity: 0.8 }}>{d.toLocaleDateString("es-ES", { month: "short" })}</div>
                    </button>
                  ))}
                </div>
              </div>
              {date !== null && (
                <div style={{ background: "#fff", borderRadius: 12, border: `1px solid ${SAND}`, padding: "1.125rem" }}>
                  <div style={{ fontFamily: "Trebuchet MS,sans-serif", fontWeight: 600, fontSize: 12, color: WINE, letterSpacing: 1, textTransform: "uppercase", marginBottom: "0.875rem" }}>Horario disponible</div>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    {exp.slots.map(s => (
                      <button key={s} onClick={() => setSlot(s)} style={{ padding: "9px 18px", borderRadius: 8, border: `1.5px solid ${slot === s ? WINE : SAND}`, background: slot === s ? WINE : "#fff", color: slot === s ? "#fff" : DARK, fontSize: 15, fontFamily: "Georgia,serif", cursor: "pointer", fontWeight: slot === s ? 700 : 400 }}>{s}</button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div>
              <div style={{ background: "#fff", borderRadius: 12, border: `1px solid ${SAND}`, padding: "1.125rem", position: "sticky", top: 12 }}>
                <div style={{ fontFamily: "Trebuchet MS,sans-serif", fontWeight: 600, fontSize: 12, color: WINE, letterSpacing: 1, textTransform: "uppercase", marginBottom: "0.875rem" }}>Tu reserva</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: "0.875rem" }}>
                  {[["Experiencia", exp.title], ["Personas", `${persons}`], date !== null && ["Fecha", fmtDate(days[date])], slot && ["Hora", slot]].filter(Boolean).map(([k, v]) => (
                    <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontFamily: "Trebuchet MS,sans-serif" }}>
                      <span style={{ color: "#999" }}>{k}</span><span style={{ color: DARK, fontWeight: 500, maxWidth: 140, textAlign: "right" }}>{v}</span>
                    </div>
                  ))}
                </div>
                <div style={{ borderTop: `1px solid ${SAND}`, paddingTop: "0.875rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontFamily: "Trebuchet MS,sans-serif", fontSize: 12, color: "#888" }}>Total</span>
                  <span style={{ fontSize: 22, fontWeight: 700, color: WINE }}>{total}€</span>
                </div>
                {date !== null && slot && <div style={{ marginTop: "0.625rem", background: "#F0FAF4", borderRadius: 8, padding: "0.625rem", fontSize: 11, color: "#2E7D4F", fontFamily: "Trebuchet MS,sans-serif" }}>✓ Disponibilidad confirmada</div>}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && exp && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: "1.25rem" }}>
            <div>
              <div style={{ background: "#fff", borderRadius: 12, border: `1px solid ${SAND}`, padding: "1.375rem" }}>
                <div style={{ fontFamily: "Trebuchet MS,sans-serif", fontWeight: 600, fontSize: 12, color: WINE, letterSpacing: 1, textTransform: "uppercase", marginBottom: "1.125rem" }}>Datos de la reserva</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 11, color: "#888", fontFamily: "Trebuchet MS,sans-serif", marginBottom: 4 }}>Nombre completo *</label>
                    <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Tu nombre" style={{ width: "100%", padding: "9px 11px", border: `1px solid ${SAND}`, borderRadius: 8, fontSize: 13, fontFamily: "Georgia,serif", boxSizing: "border-box" }} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 11, color: "#888", fontFamily: "Trebuchet MS,sans-serif", marginBottom: 4 }}>Email *</label>
                    <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="tu@email.com" style={{ width: "100%", padding: "9px 11px", border: `1px solid ${SAND}`, borderRadius: 8, fontSize: 13, fontFamily: "Georgia,serif", boxSizing: "border-box" }} />
                  </div>
                </div>
                <div style={{ marginBottom: 10 }}>
                  <label style={{ display: "block", fontSize: 11, color: "#888", fontFamily: "Trebuchet MS,sans-serif", marginBottom: 4 }}>Teléfono</label>
                  <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+34 600 000 000" style={{ width: "100%", padding: "9px 11px", border: `1px solid ${SAND}`, borderRadius: 8, fontSize: 13, fontFamily: "Georgia,serif", boxSizing: "border-box" }} />
                </div>
                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: "block", fontSize: 11, color: "#888", fontFamily: "Trebuchet MS,sans-serif", marginBottom: 4 }}>Comentarios o peticiones especiales</label>
                  <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Alergias, fechas especiales, preferencias..." rows={3} style={{ width: "100%", padding: "9px 11px", border: `1px solid ${SAND}`, borderRadius: 8, fontSize: 13, fontFamily: "Georgia,serif", resize: "vertical", boxSizing: "border-box" }} />
                </div>

                <div style={{ background: CREAM, borderRadius: 10, padding: "0.875rem 1rem", marginBottom: 14 }}>
                  <div style={{ fontFamily: "Trebuchet MS,sans-serif", fontSize: 11, color: "#888", marginBottom: 7 }}>Pago seguro</div>
                  <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 7 }}>
                    <div><label style={{ display: "block", fontSize: 10, color: "#999", fontFamily: "Trebuchet MS,sans-serif", marginBottom: 3 }}>Número de tarjeta</label><input type="text" placeholder="•••• •••• •••• ••••" style={{ width: "100%", padding: "7px 9px", border: `1px solid ${SAND}`, borderRadius: 6, fontSize: 12, boxSizing: "border-box" }} /></div>
                    <div><label style={{ display: "block", fontSize: 10, color: "#999", fontFamily: "Trebuchet MS,sans-serif", marginBottom: 3 }}>Caducidad</label><input type="text" placeholder="MM/AA" style={{ width: "100%", padding: "7px 9px", border: `1px solid ${SAND}`, borderRadius: 6, fontSize: 12, boxSizing: "border-box" }} /></div>
                    <div><label style={{ display: "block", fontSize: 10, color: "#999", fontFamily: "Trebuchet MS,sans-serif", marginBottom: 3 }}>CVV</label><input type="text" placeholder="•••" style={{ width: "100%", padding: "7px 9px", border: `1px solid ${SAND}`, borderRadius: 6, fontSize: 12, boxSizing: "border-box" }} /></div>
                  </div>
                  <div style={{ fontSize: 10, color: "#aaa", marginTop: 7, fontFamily: "Trebuchet MS,sans-serif" }}>🔒 Demo — no se realizará ningún cargo real</div>
                </div>

                {sendError && (
                  <div style={{ background: "#FFF3CD", border: "1px solid #FFDA6A", borderRadius: 8, padding: "10px 14px", marginBottom: 12, fontSize: 12, color: "#856404", fontFamily: "Trebuchet MS,sans-serif" }}>
                    ⚠️ {sendError}
                  </div>
                )}

                <button onClick={handleSubmit} disabled={!form.name || !form.email || sending}
                  style={{ width: "100%", padding: "0.875rem", background: form.name && form.email && !sending ? WINE : "#ddd", color: "#fff", border: "none", borderRadius: 10, fontSize: 15, fontFamily: "Georgia,serif", cursor: form.name && form.email && !sending ? "pointer" : "not-allowed" }}>
                  {sending ? "Enviando confirmación..." : `Confirmar reserva · ${total}€`}
                </button>
              </div>
            </div>
            <div>
              <div style={{ background: "#fff", borderRadius: 12, border: `1px solid ${SAND}`, padding: "1.125rem", position: "sticky", top: 12 }}>
                <div style={{ background: exp.color, borderRadius: 8, padding: "0.875rem", marginBottom: "0.875rem", display: "flex", gap: 10, alignItems: "center" }}>
                  <span style={{ fontSize: 22 }}>{exp.image}</span>
                  <div style={{ color: "#fff", fontSize: 13, fontWeight: 600, lineHeight: 1.3 }}>{exp.title}</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                  {[["Personas", `${persons}`], ["Fecha", fmtDate(days[date])], ["Hora", slot], ["Precio/persona", `${exp.price}€`]].map(([k, v]) => (
                    <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontFamily: "Trebuchet MS,sans-serif" }}>
                      <span style={{ color: "#999" }}>{k}</span><span style={{ color: DARK, fontWeight: 500 }}>{v}</span>
                    </div>
                  ))}
                </div>
                <div style={{ borderTop: `1px solid ${SAND}`, paddingTop: "0.875rem", marginTop: "0.875rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontFamily: "Trebuchet MS,sans-serif", fontSize: 12, color: "#888" }}>Total a pagar</span>
                  <span style={{ fontSize: 24, fontWeight: 700, color: WINE }}>{total}€</span>
                </div>
                <div style={{ marginTop: "0.625rem", fontSize: 10, color: "#aaa", fontFamily: "Trebuchet MS,sans-serif", lineHeight: 1.5 }}>Cancela sin coste hasta 48h antes · Confirmación inmediata por email</div>
              </div>
            </div>
          </div>
        )}

        {/* Nav */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.75rem", paddingTop: "1.25rem", borderTop: `1px solid ${SAND}` }}>
          <button onClick={() => step > 0 && setStep(step - 1)} disabled={step === 0} style={{ padding: "9px 22px", border: `1.5px solid ${SAND}`, borderRadius: 8, background: "#fff", color: step === 0 ? "#ccc" : DARK, fontSize: 13, fontFamily: "Georgia,serif", cursor: step === 0 ? "default" : "pointer" }}>← Atrás</button>
          <div style={{ display: "flex", gap: 7 }}>{steps.map((_, i) => <div key={i} style={{ width: i === step ? 22 : 8, height: 8, borderRadius: 4, background: i === step ? WINE : i < step ? GOLD : SAND, transition: "all 0.2s" }} />)}</div>
          {step < 2 ? <button onClick={() => canProceed && setStep(step + 1)} disabled={!canProceed} style={{ padding: "9px 26px", border: "none", borderRadius: 8, background: canProceed ? WINE : "#ddd", color: "#fff", fontSize: 13, fontFamily: "Georgia,serif", cursor: canProceed ? "pointer" : "not-allowed" }}>Continuar →</button> : <div style={{ width: 90 }} />}
        </div>
      </div>

      <div style={{ background: DARK, color: "#666", padding: "1.25rem 1.5rem", textAlign: "center", fontSize: 10, fontFamily: "Trebuchet MS,sans-serif" }}>
        Concejo Hospedería · Ctra. Valoria Km 3,6 · 47200 Valoria la Buena (Valladolid) · +34 983 502 263
        <span style={{ margin: "0 10px", color: "#333" }}>·</span>
        <span style={{ color: GOLD }}>Motor de experiencias by Turneo</span>
      </div>
    </div>
  );
}
