import Image from "next/image";

export default function Page() {
  return (
    <div className=" conatainer  max-w-4xl m-auto flex flex-col items-center min-h-screen  px-4 py-10 sm:py-20 font-[family-name:var(--font-cormorant-garamond)]">
      <section className="w-full flex flex-col md:flex-row items-center gap-8 mb-16">
        <div className="w-full md:w-1/2 group transition-all duration-700">
          <Image
            src="/teamphoto2.jpeg"
            alt="Nuestro equipo"
            width={600}
            height={400}
            className="rounded-2xl shadow-lg object-cover w-full h-64 md:h-80 scale-100 group-hover:scale-105 transition-transform duration-700"
            priority
            // style={{
            //   objectPosition: " 44.6283% 8.4739%",
            // }}
          />
        </div>
        <div className="w-full md:w-1/2 text-center md:text-left">
          <h1 className="text-important text-4xl sm:text-6xl font-bold mb-4 text-primary transition-all duration-700 ease-out hover:tracking-wide">
            Oly & Ashley
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground transition-opacity duration-700 ease-in hover:opacity-80">
            Two voices, one home. Rooted in different lands, shaped by survival,
            stitched together by healing. We created Raíces & Returnings to hold
            everything that never fit neatly into categories— love that defies
            scripts, food that carries memory, queerness that feels holy, and
            stories that don’t end where they began. It’s part blog, part
            kitchen table, part altar. A little messy. Deeply honest. And always
            real.
          </p>
        </div>
      </section>
      <section className="w-full  flex flex-col-reverse md:flex-row items-center gap-8 mb-16">
        <div className="w-full md:w-1/2 text-center md:text-left">
          <h3 className="text-2xl font-semibold mb-2 text-primary transition-colors duration-700">
            Olydi
          </h3>
          <span className=" text-muted-foreground text-lg sm:text-xl mb-2">
            Truth-Teller & Rooter Creator
          </span>
          <p className="text-lg sm:text-xl text-muted-foreground text-center transition-opacity duration-700 hover:opacity-80">
            I was born in Venezuela and raised by real life—not by a plan. I’ve
            lived through silence, migration, heartbreak, survival. I’ve lost
            parts of myself and found new ones in places I never expected. I’m
            not here to impress anyone—I’m here because I know what it means to
            start over. More than once. You’ll find me mostly in the kitchen
            section of this site—where food becomes language and memory. But I’m
            also part of everything else: the healing, the humor, the truth. I’m
            here because I believe what I share.
          </p>
        </div>
        <div className="w-full md:w-1/2 group transition-all duration-700">
          <Image
            src="/profile3.jpeg"
            alt="Nuestro equipo"
            width={600}
            height={400}
            className="rounded-2xl shadow-lg object-cover w-full h-64 md:h-80 scale-100 group-hover:scale-105 transition-transform duration-700"
            priority
            // style={{
            //   objectPosition: " 44.6283% 28.4739%",
            // }}
          />
        </div>
      </section>
      <section className="w-full flex flex-col md:flex-row items-center gap-8 mb-16">
        <div className="w-full md:w-1/2 group transition-all duration-700">
          <Image
            src="/profile4.jpeg"
            alt="Nuestro equipo"
            width={600}
            height={400}
            className="rounded-2xl shadow-lg object-cover w-full h-64 md:h-80 scale-100 group-hover:scale-105 transition-transform duration-700"
            priority

            // style={{
            //   objectPosition: "49.1825% 17.865%",
            // }}
          />
        </div>

        <div className="w-full md:w-1/2 text-center md:text-left">
          <h3 className="text-2xl font-semibold mb-2 text-primary transition-colors duration-700">
            Ashley
          </h3>
          <span className=" text-muted-foreground text-lg sm:text-xl mb-2">
            Conscious Creator
          </span>
          <p className="text-lg sm:text-xl text-muted-foreground text-center transition-opacity duration-700 hover:opacity-80">
            I’m a conscious creator—of words, of space, of meaning. I was shaped
            in the in-between. Between languages. Between cultures. I’ve lived
            through things that made me question everything—then offered me a
            voice to speak through it. Now, I live with intention. I write to
            remember. I create to reclaim. I’ve lived through chaos, through
            closeting, through calling. Now, I live in a way that honors all of
            it. My voice here is rooted in reflection—on identity, spirituality,
            queerness, healing, and the sacredness of returning.
          </p>
        </div>
      </section>
    </div>
  );
}
