import { useState } from 'react';
import Reveal from './Reveal';
import MaskText from './MaskText';

export default function Contact() {
  const [sent, setSent] = useState(false);
  const field =
    'w-full border-b border-bone/15 bg-transparent py-3 font-sans text-bone placeholder:text-bone-faint focus:border-gold focus:outline-none transition-colors';

  return (
    <section
      id="agendar"
      className="relative z-10 mx-auto flex min-h-[80vh] max-w-2xl flex-col items-center justify-center px-6 py-32 text-center"
    >
      <Reveal>
        <p className="mb-8 font-mono text-[10px] uppercase tracking-[0.5em] text-gold/70">
          v — reserva
        </p>
      </Reveal>
      <MaskText className="font-display text-5xl font-light italic text-bone sm:text-7xl">
        Vamos criar
      </MaskText>

      {sent ? (
        <Reveal>
          <p className="mt-12 font-display text-2xl italic text-bone">
            Recebido. Em breve respondemos. ✦
          </p>
        </Reveal>
      ) : (
        <Reveal delay={0.1}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
            className="mt-12 w-full space-y-8 text-left"
          >
            <input className={field} placeholder="Nome" required />
            <input className={field} placeholder="WhatsApp ou e-mail" required />
            <textarea rows={2} className={`${field} resize-none`} placeholder="Sua ideia" />
            <div className="flex justify-center pt-4">
              <button
                type="submit"
                className="border border-bone/20 px-10 py-3 font-mono text-[11px] uppercase tracking-[0.3em] text-bone transition-colors hover:border-gold hover:text-gold"
              >
                Enviar →
              </button>
            </div>
          </form>
        </Reveal>
      )}
    </section>
  );
}
