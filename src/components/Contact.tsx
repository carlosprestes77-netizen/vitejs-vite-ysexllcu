import { useState } from 'react';
import Reveal from './Reveal';
import MaskText from './MaskText';

export default function Contact() {
  const [sent, setSent] = useState(false);

  const field =
    'w-full border-b border-bone/12 bg-transparent py-4 font-sans text-[13px] text-bone placeholder:text-bone-faint focus:border-gold focus:outline-none transition-colors';

  return (
    <section
      id="agendar"
      className="relative z-10 px-7 py-40 sm:px-12 lg:py-48"
    >
      <div className="mx-auto max-w-lg">
        {/* Section label */}
        <Reveal>
          <p className="mb-14 font-mono text-[9px] uppercase tracking-[0.6em] text-gold/60">
            v — reserva
          </p>
        </Reveal>

        {/* Split title reveal */}
        <div className="mb-16">
          <MaskText
            className="font-display font-light leading-[0.92] text-bone"
            style={{ fontSize: 'clamp(3.4rem, 12vw, 7.5rem)' }}
          >
            Vamos
          </MaskText>
          <MaskText
            className="font-display font-light italic leading-[0.92] text-bone-dim"
            style={{ fontSize: 'clamp(3.4rem, 12vw, 7.5rem)' }}
            delay={0.1}
          >
            criar.
          </MaskText>
        </div>

        {sent ? (
          <Reveal>
            <p className="font-display text-2xl font-light italic text-bone/80">
              Recebido. Em breve respondemos. ✦
            </p>
          </Reveal>
        ) : (
          <Reveal delay={0.12}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
              className="space-y-9"
            >
              <input className={field} placeholder="Nome" required />
              <input className={field} placeholder="WhatsApp ou e-mail" required />
              <textarea
                rows={3}
                className={`${field} resize-none`}
                placeholder="Sua ideia — sem filtros"
              />
              <div className="pt-3">
                <button
                  type="submit"
                  className="group border border-bone/20 px-10 py-3.5 font-mono text-[10px] uppercase tracking-[0.45em] text-bone transition-all duration-300 hover:border-gold hover:text-gold"
                >
                  Enviar
                  <span className="ml-3 opacity-40 transition-opacity group-hover:opacity-100">
                    →
                  </span>
                </button>
              </div>
            </form>
          </Reveal>
        )}
      </div>
    </section>
  );
}
