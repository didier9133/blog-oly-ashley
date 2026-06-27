import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { User } from "lucide-react";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import PostsTable from "./posts-table";

export default async function Page() {
  const t = await getTranslations("dashboard.page");
  // Obtener los posts filtrados desde la base de datos
  const { userId } = await auth();

  const rawData = await prisma.post.findMany({
    where: {
      authorId: userId!, // Filtrar por el usuario autenticado
    },
    orderBy: { updatedAt: "desc" },
    include: { author: true, category: true },
  });

  // Transformar los datos para incluir el nombre del autor y la categoría
  const postData = rawData.map((post) => ({
    ...post,
    author: {
      ...post.author,
      name: `${post.author.firstName} ${post.author.lastName}`,
    },
  }));

  const draftsCount = postData.filter((p) => !p.published).length;

  return (
    <div className="min-h-screen  font-[family-name:var(--font-lora)]">
      <div>
        <div className="container   max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center pt-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold font-[family-name:var(--font-cormorant-garamond)]">
                {t("title")}
              </h1>
              <p className="mt-1 text-sm text-gray-400">{t("subtitle")}</p>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/dashboard/newsletter">
                <Button variant="outline">{t("subscribers")}</Button>
              </Link>
              <Link href="/dashboard/create">
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  {t("newPost")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="container   max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mensaje de bienvenida personalizado */}
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-200 rounded-full">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-primary font-[family-name:var(--font-cormorant-garamond)]">
                  {t("welcomeTitle")}
                </h2>
                <p className="text-gray-400 mt-1">
                  {t("welcomeSummary", {
                    total: postData.length,
                    drafts: draftsCount,
                  })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <PostsTable data={postData} />
      </div>
    </div>
  );
}
