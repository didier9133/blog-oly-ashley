import { getTranslations } from "next-intl/server";
import Image from "next/image";

export default async function Page() {
  const t = await getTranslations("About");

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
          />
        </div>
        <div className="w-full md:w-1/2 text-center md:text-left">
          <h1 className="text-important text-4xl sm:text-6xl font-bold mb-4 text-primary transition-all duration-700 ease-out hover:tracking-wide">
            Oly & Ashley
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground transition-opacity duration-700 ease-in hover:opacity-80">
            {t("introduction-paragraph")}
          </p>
        </div>
      </section>
      <section className="w-full  flex flex-col-reverse md:flex-row items-center gap-8 mb-16">
        <div className="w-full md:w-1/2 text-center md:text-left">
          <h3 className="text-2xl font-semibold mb-2 text-primary transition-colors duration-700">
            Olydi
          </h3>
          <span className=" text-muted-foreground text-lg sm:text-xl">
            {t("description-oly")}
          </span>
          <p className="text-lg sm:text-xl text-muted-foreground text-center transition-opacity duration-700 hover:opacity-80">
            {t("description-paragraph-oly")}
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
          />
        </div>

        <div className="w-full md:w-1/2 text-center md:text-left">
          <h3 className="text-2xl font-semibold mb-2 text-primary transition-colors duration-700">
            Ashley
          </h3>
          <span className="text-muted-foreground text-lg sm:text-xl mb-2">
            {t("description-ashley")}
          </span>
          <p className="text-lg sm:text-xl text-muted-foreground text-center transition-opacity duration-700 hover:opacity-80">
            {t("description-paragraph-ashley")}
          </p>
        </div>
      </section>
    </div>
  );
}
