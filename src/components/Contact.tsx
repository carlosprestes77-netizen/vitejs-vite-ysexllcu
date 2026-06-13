import { useState } from 'react';
import Reveal from './Reveal';

export default function Contact() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  const field =
    'w-full border-b border-bone/20 bg-transparent py-3 font-sans text-bone placeholder:text-bone-faint focus:border-blood focus:outline-none transition-colors';

  return (
    <section
      id="agendar"
      className="relative z-10 border-t border-bone/10 bg-ink-800/40 py-32 backdrop-blur-sm"
    >
      <div className="mx-auto max-w-5xl px-6 lg:px-10">
        <Reveal>
          <div className="text-center">
            <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-blood">
              ⊹ Nº 05 · Reserva
            </p>
            <h2 className="mt-4 font-display text-5xl font-black leading-none text-bone sm:text-8xl">
              Vamos <span className="italic text-stroke">criar</span>
            </h2>
            <p className="mx-auto mt-6 max-w-md text-sm font-light text-bone-dim">
              Conte sua ideia. Respondemos com disponibilidade, orçamento e um
              esboço inicial do projeto.
            </p>
          </div>
        </Reveal>

        {sent ? (
          <Reveal>
            <div className="mt-16 border border-blood/40 bg-blood/5 p-12 text-center">
              <p className="font-display text-3xl font-bold text-bone">
                Recebido. ✦
              </p>
              <p className="mt-3 text-sm font-light text-bone-dim">
                Seu pedido foi registrado. (Front-end demonstrativo — posso
                conectar ao WhatsApp ou banco de dados quando quiser.)
              </p>
              <button
                onClick={() => setSent(false)}
                className="mt-6 font-mono text-[11px] uppercase tracking-[0.25em] text-gold hover:text-blood"
              >
                ← enviar outro
              </button>
            </div>
          </Reveal>
        ) : (
          <Reveal delay={0.1}>
            <form
              onSubmit={handleSubmit}
              className="mt-16 grid gap-x-10 gap-y-8 sm:grid-cols-2"
            >
              <div>
                <label className="font-mono text-[10px] uppercase tracking-[0.25em] text-bone-faint">
                  Nome
                </label>
                <input className={field} placeholder="Como te chamam" required />
              </div>
              <div>
                <label className="font-mono text-[10px] uppercase tracking-[0.25em] text-bone-faint">
                  Contato
                </label>
                <input
                  className={field}
                  placeholder="WhatsApp ou e-mail"
                  required
                />
              </div>
              <div>
                <label className="font-mono text-[10px] uppercase tracking-[0.25em] text-bone-faint">
                  Estilo
                </label>
                <select className={`${field} appearance-none`} defaultValue="">
                  <option value="" disabled className="bg-ink">
                    Selecione
                  </option>
                  {['Blackwork', 'Fine Line', 'Realismo', 'Geométrico', 'Outro'].map(
                    (o) => (
                      <option key={o} className="bg-ink">
                        {o}
                      </option>
                    )
                  )}
                </select>
              </div>
              <div>
                <label className="font-mono text-[10px] uppercase tracking-[0.25em] text-bone-faint">
                  Local do corpo
                </label>
                <input className={field} placeholder="Braço, costas, perna…" />
              </div>
              <div className="sm:col-span-2">
                <label className="font-mono text-[10px] uppercase tracking-[0.25em] text-bone-faint">
                  Sua ideia
                </label>
                <textarea
                  rows={3}
                  className={`${field} resize-none`}
                  placeholder="Descreva a tatuagem dos seus sonhos…"
                />
              </div>

              <div className="sm:col-span-2 flex justify-center">
                <button
                  type="submit"
                  className="group relative overflow-hidden border border-blood px-12 py-4 font-mono text-[12px] uppercase tracking-[0.3em] text-blood transition-colors hover:text-bone"
                >
                  <span className="relative z-10">Enviar pedido →</span>
                  <span className="absolute inset-0 -translate-x-full bg-blood transition-transform duration-500 group-hover:translate-x-0" />
                </button>
              </div>
            </form>
          </Reveal>
        )}
      </div>
    </section>
  );
}
