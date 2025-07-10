"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ParallaxHeroProps {
  imageSrc: string;
  imageAlt: string;
  height?: string;
  children?: React.ReactNode;
  overlayOpacity?: number; // 0 a 1
  className?: string;
}

export function ParallaxHero({
  imageSrc,
  imageAlt,
  height = "88vh",
  children,
  overlayOpacity = 0.3,
  className, // Clase adicional para el contenedor del contenido
}: ParallaxHeroProps) {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    // Añadir el event listener
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Limpiar event listener en unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ height: `calc(${height} - 64px)` }}
    >
      {/* Contenedor para la imagen y el overlay que se mueven juntos */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          transform: `translateY(${scrollY * 0.4}px)`,
        }}
      >
        {/* Imagen de fondo */}
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />

        {/* Overlay oscuro dentro del mismo contenedor que la imagen */}
        <div
          className="absolute inset-0 w-full h-full bg-black"
          style={{ opacity: overlayOpacity }}
        ></div>
      </div>
      {/* Gradiente de difuminado inferior */}
      <div className="absolute bottom-0 left-0 right-0 h-48 z-[5] pointer-events-none bg-gradient-to-b from-transparent to-transparent dark:from-transparent dark:via-background/30 dark:to-background"></div>

      {/* Contenedor para el contenido (no se mueve con el efecto parallax) */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div
          className={cn(
            "container mx-auto px-4 text-center text-white pt-52",
            className
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
