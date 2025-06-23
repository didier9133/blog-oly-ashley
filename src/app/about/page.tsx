import Image from "next/image";

export default function Page() {
  return (
    <div className=" conatainer  max-w-4xl m-auto flex flex-col items-center min-h-screen  px-4 py-10 sm:py-20 font-[family-name:var(--font-cormorant-garamond)]">
      <section className="w-full flex flex-col md:flex-row items-center gap-8 mb-16">
        <div className="w-full md:w-1/2 group transition-all duration-700">
          <Image
            src="/teamphoto.jpeg"
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
          <h1 className="text-4xl sm:text-6xl font-bold mb-4 text-primary transition-all duration-700 ease-out hover:tracking-wide">
            Raices & Returnings
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground transition-opacity duration-700 ease-in hover:opacity-80">
            We&apos;ve made it out of the closet, now it&apos;s time to unpack
            all that comes with finding yourself! Every week, Mal Glowenke, a
            recovering Texas-raised lesbian, will bring her unfiltered
            perspective to conversations with other queer people across the
            country, digging into everything from relationships to religion, sex
            and culture, and anything that affects or interests the lesbian
            community.
          </p>
        </div>
      </section>
      <section className="w-full  flex flex-col-reverse md:flex-row items-center gap-8 mb-16">
        <div className="w-full md:w-1/2 text-center md:text-left">
          <h3 className="text-xl font-semibold mb-2 text-primary transition-colors duration-700">
            Mallorie Glownke
          </h3>
          <span className="text-muted-foreground text-sm mb-2">
            Host & Producer
          </span>
          <p className="text-muted-foreground text-center transition-opacity duration-700 hover:opacity-80">
            Mal is a Texas-raised lesbian who made it out of the heterosexual
            trap to start a new life in LA. Her hobbies include hiking,
            meditating, and unpacking all her trauma on a mic.
          </p>
        </div>
        <div className="w-full md:w-1/2 group transition-all duration-700">
          <Image
            src="/profile.jpeg"
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
            src="/profile2.jpeg"
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
          <h3 className="text-xl font-semibold mb-2 text-primary transition-colors duration-700">
            Mathilde Jourdan
          </h3>
          <span className="text-muted-foreground text-sm mb-2">
            producer, co-creator
          </span>
          <p className="text-muted-foreground text-center transition-opacity duration-700 hover:opacity-80">
            Mathilde grew up in Portugal and moved to LA to pursue
            entertainment. After a short stint at WME (see: Brie Larson cup) she
            produced reality tv and documentaries before finding her passion in
            creating lesbian content. Mathilde directs, produces and edits every
            episode of Made It Out.
          </p>
        </div>
      </section>
    </div>
  );
}
