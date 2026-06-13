/**
 * A restrained cinematic grade over the whole site: a soft film colour
 * wash and a slow drifting light leak. No HUD, no letterbox, no clutter —
 * the grain (body) and vignette do the rest.
 */
export default function CinematicOverlay() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[9990]">
      <div className="cine-grade absolute inset-0" />
      <div className="cine-leak absolute inset-0" />
    </div>
  );
}
