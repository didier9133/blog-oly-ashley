import { Button } from "@/components/ui/button";
import { currentUser } from "@clerk/nextjs/server";
import { Plus, Sparkles, Coffee, Heart, NotebookPen } from "lucide-react";
import Link from "next/link";

export default async function NoPostsView() {
  const user = await currentUser();
  const isAdmin = Boolean(user?.publicMetadata?.isAdmin);
  return (
    <div className="font-[family-name:var(--font-lora)]">
      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Decorative Elements */}
          <div className="relative mb-8">
            <div className="absolute -top-4 -left-4 text-rose-200 animate-pulse">
              <Sparkles className="h-6 w-6" />
            </div>
            <div className="absolute -top-2 -right-6 text-amber-200 animate-bounce">
              <Heart className="h-4 w-4" />
            </div>
            <div className="absolute -bottom-2 left-8 text-stone-200 animate-pulse">
              <Coffee className="h-5 w-5" />
            </div>

            {/* Main Icon */}
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-rose-100 to-amber-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
              <NotebookPen className="h-12 w-12 text-rose-400" />
            </div>
          </div>

          {/* Main Message */}
          <div className="space-y-4 mb-8">
            <h1 className="text-4xl md:text-5xl font-light  tracking-wide font-[family-name:var(--font-cormorant-garamond)]">
              No hay posts
            </h1>
            <p className="text-lg   font-light max-w-md mx-auto leading-relaxed">
              El lienzo está en blanco, esperando las primeras pinceladas de tu
              creatividad
            </p>
          </div>

          {/* Subtle Quote */}
          <div className="mb-12">
            <blockquote className=" italic text-sm font-light">
              &quot;Cada gran historia comienza con una página en blanco&quot;
            </blockquote>
          </div>

          {/* Action Buttons */}

          {isAdmin && (
            <div className="flex justify-center items-center">
              <Link href="/dashboard/create">
                <Button size="lg">
                  <Plus className="h-5 w-5 mr-2 group-hover:rotate-90 transition-transform duration-200" />
                  Crear mi primer post
                </Button>
              </Link>
            </div>
          )}
        </div>
      </main>

      {/* Subtle Background Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.15) 1px, transparent 0)`,
            backgroundSize: "20px 20px",
          }}
        />
      </div>
    </div>
  );
}
