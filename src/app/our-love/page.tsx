import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Gem, BookHeart, Plane, CloudRain, Church } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const timelineData = [
  {
    year: "2024",
    title: "La Propuesta",
    description:
      "Bajo las estrellas en Santorini, Alex se arrodilló con un anillo hecho a mano. El 'sí' de Sam resonó en el mar Egeo mientras sellaban su compromiso con lágrimas y risas.",
    icon: Gem, // Icono de anillo de compromiso
    category: "Compromiso",
    image: "/DSC01227.jpeg",
  },
  {
    year: "2023",
    title: "Nuestro Hogar",
    description:
      "Juntas firmaron la hipoteca de su loft con vista al parque. Cada mueble elegido, cada planta en el balcón, fue un acto de amor que transformó cuatro paredes en su refugio.",
    icon: BookHeart, // Icono de casa con corazón
    category: "Hogar",
    image: "/DSC01285.jpeg",
  },
  {
    year: "2022",
    title: "Primera Luna de Miel",
    description:
      "Maletas en mano, descubriern Costa Rica durante 3 semanas. Desde el canopy en la selva hasta nadar en bioluminiscencia, cada aventura profundizó su conexión.",
    icon: Plane, // Icono de avión
    category: "Viajes",
    image: "/DSC01407.jpeg",
  },
  {
    year: "2021",
    title: "El Primer 'Te Amo'",
    description:
      "Atrapadas en un aguacero después del cine, corrieron riendo hacia un portal. Al resguardarse, sus miradas se encontraron y las palabras brotaron al unísono bajo la lluvia.",
    icon: CloudRain, // Icono de lluvia
    category: "Confesiones",
    image: "/DSC01438.jpeg",
  },
  {
    year: "2020",
    title: "Cita Cero",
    description:
      "En la sección de poesía de la librería 'El Sur', sus manos rozaron el mismo libro de Alejandra Pizarnik. El café que siguió duró 5 horas y el resto es historia.",
    icon: Church, // Icono de libro con corazón
    category: "Orígenes",
    image: "/DSC01529.jpeg",
  },
];

export default async function Page() {
  return (
    <div className=" conatainer  max-w-4xl m-auto flex flex-col items-center min-h-screen  px-4 py-10 sm:py-20 font-[family-name:var(--font-cormorant-garamond)]">
      <div className=" w-full flex flex-col items-center mb-16">
        <h1 className="text-4xl sm:text-6xl font-bold mb-4 text-primary transition-all duration-700 ease-out hover:tracking-wide">
          Our Love
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          We&apos;ve made it out of the closet, now it&apos;s time to unpack all
          that comes with finding yourself! Every week, Mal Glowenke, a
          recovering Texas-raised lesbian, will bring her unfiltered perspective
          to conversations with other queer people across the country, digging
          into everything from relationships to religion, sex and culture, and
          anything that affects or interests the lesbian community.
        </p>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-orange-200 to-amber-50/30"></div>

        <div className="space-y-8">
          {timelineData
            .slice()
            .reverse()
            .map((item, index) => (
              <div key={index} className="relative flex items-start group">
                {/* Timeline dot */}
                <div className="relative z-10 flex items-center justify-center w-16 h-16 bg-white rounded-full border-4 border-blue-100 shadow-lg group-hover:border-blue-200 transition-colors duration-300">
                  <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-primary to-amber-600 rounded-full text-white">
                    <item.icon className="w-4 h-4" />
                  </div>
                </div>

                {/* Content card */}
                <Card className="ml-8 flex-1 bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02]">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <Badge variant="default">{item.year}</Badge>
                          <Badge
                            variant="outline"
                            className="text-gray-600 border-gray-200"
                          >
                            {item.category}
                          </Badge>
                        </div>

                        <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                          {item.title}
                        </h3>

                        <p className="text-gray-600 leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      <div className="lg:w-64 flex-shrink-0">
                        <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 aspect-video">
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105 group-hover:filter group-hover:brightness-110"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
