import Meander from './art/Meander';

/** A gallery-style section divider: hairlines flanking a Greek meander, with
 *  an optional small label beneath. */
export default function Divider({
  label,
  idKey = '',
}: {
  label?: string;
  idKey?: string;
}) {
  return (
    <div className="relative z-10 mx-auto max-w-7xl px-7 py-12 sm:px-12">
      <div className="flex items-center gap-6">
        <span className="h-px flex-1 bg-bone/10" />
        <Meander
          height={18}
          unit={18}
          opacity={0.5}
          idKey={idKey}
          className="w-[180px] shrink-0 sm:w-[240px]"
        />
        <span className="h-px flex-1 bg-bone/10" />
      </div>
      {label && (
        <p className="mt-5 text-center font-sans text-[10px] uppercase tracking-[0.6em] text-bone/25">
          {label}
        </p>
      )}
    </div>
  );
}
