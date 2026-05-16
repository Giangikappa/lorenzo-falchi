import Image from "next/image";

export default function About() {
  return (
    <section id="about" className="py-24 px-6 lg:px-12 bg-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Foto Lorenzo */}
        <div className="relative">
          <div className="aspect-[4/5] relative w-full overflow-hidden bg-stone-900">
            <Image
              src="/uploads/lorenzo-profile.jpg"
              alt="Lorenzo Falchi"
              fill
              className="object-cover object-center"
              unoptimized
            />
          </div>
          <div className="absolute -bottom-6 -right-6 w-32 h-32 border border-gold opacity-40" />
          <div className="absolute -top-6 -left-6 w-32 h-32 border border-stone-200" />
        </div>

        {/* Text */}
        <div className="flex flex-col gap-8">
          <div>
            <p className="label-small mb-4">La storia</p>
            <h2 className="section-title mb-6">
              Dall&apos;ispirazione digitale<br />
              alla <em className="text-gold not-italic">materia preziosa</em>
            </h2>
          </div>

          <div className="space-y-5 text-stone-600 leading-relaxed">
            <p>
              Vivo nel confine tra il mondo digitale e quello artigianale.
              Ogni mio gioiello nasce da un&apos;osservazione: un trend sui social,
              un format virale, un&apos;estetica del momento che sento mia.
            </p>
            <p>
              Quello che vedi scorrere sui tuoi feed, io lo trasformo in oggetti
              fisici — anelli, collane, bracciali — lavorati a mano, pezzi unici o in
              edizione limitata che portano con sé il tempo in cui sono nati.
            </p>
            <p>
              Non seguire la moda. <strong className="text-stone-900 font-medium">Indossala prima che passi.</strong>
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6 pt-4 border-t border-stone-100">
            {[
              { value: "100%", label: "Fatto a mano" },
              { value: "—", label: "Pezzi di serie" },
              { value: "∞", label: "Storie uniche" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col gap-1">
                <span className="font-serif text-3xl text-stone-900">{stat.value}</span>
                <span className="text-xs tracking-widest uppercase text-stone-400">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
