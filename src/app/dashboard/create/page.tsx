"use client";

import { useEffect, useState, useRef } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
// import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { z } from "zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  getCategoriesWithSubcategories,
  saveNewPost,
} from "@/app/actions/posts";
import { Subcategory, Category } from "../../generated/prisma/index";
import RichTextEditor from "@/components/rich-text-editor";
import { uploadImageToS3 } from "@/app/actions/images";
import DOMPurify from "isomorphic-dompurify";
import Link from "next/link";

const FILE_SIZE_LIMIT = 5 * 1024 * 1024; // 5MB

const formPostSchema = z.object({
  title: z.string().min(1, "El título es obligatorio"),
  category: z.string().min(1, "La categoría es obligatoria"),
  subcategory: z.string().min(1, "La subcategoría es obligatoria"),
  isPublished: z.boolean(),
  image: z.lazy(() =>
    typeof window !== "undefined"
      ? z
          .any()
          .refine((files) => files instanceof FileList, {
            message: "La imagen es obligatoria",
          })
          .refine((files) => !(files instanceof FileList) || files.length > 0, {
            message: "La imagen es obligatoria",
          })
          .refine(
            (files) =>
              !(files instanceof FileList) ||
              files.length === 0 ||
              files[0].size <= FILE_SIZE_LIMIT,
            {
              message: "Tamaño máximo de imagen 5MB",
            }
          )
          .refine(
            (files) =>
              !(files instanceof FileList) ||
              files.length === 0 ||
              /^image\/(jpeg|png|gif|webp|svg\+xml)$/.test(files[0].type),
            {
              message:
                "Formato de imagen no válido. Usa JPG, PNG, GIF, WEBP o SVG",
            }
          )
      : z.any()
  ),
});

type FormPost = z.infer<typeof formPostSchema>;
interface CategoryWithSub extends Category {
  subcategories: Subcategory[];
}

export default function CreatePostPage() {
  const [subcategories, setSubcategories] = useState<
    { categoryId: number; name: string; id: number }[]
  >([]);
  const [categories, setCategories] = useState<CategoryWithSub[]>([]);
  const [subCategoriesAll, setSubCategoriesAll] = useState<Subcategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [content, setContent] = useState("");

  const formPost = useForm<FormPost>({
    resolver: zodResolver(formPostSchema),
    defaultValues: {
      title: "",
      category: "",
      subcategory: "",
      isPublished: false,
    },
  });

  // Guardar el valor anterior de la categoría
  const prevCategoryRef = useRef<string>("");

  useEffect(() => {
    const subscription = formPost.watch((value, { name }) => {
      // Si cambia la categoría, limpiar subcategoría y actualizar subcategorías disponibles
      if (name === "category" && value.category !== prevCategoryRef.current) {
        setSubcategories(() =>
          subCategoriesAll.filter(
            (sub) => sub.categoryId === Number(value.category)
          )
        );
        prevCategoryRef.current = value.category ?? "";
        formPost.resetField("subcategory");
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [formPost, subCategoriesAll]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const categoriesWithSubcategories =
          await getCategoriesWithSubcategories();
        setCategories(categoriesWithSubcategories);
        if (
          categoriesWithSubcategories &&
          categoriesWithSubcategories.length > 0
        ) {
          // Recorre todas las categorías y junta todas las subcategorías en un solo array
          const allSubcategories = categoriesWithSubcategories.flatMap(
            (cat: { subcategories: Subcategory[] }) =>
              cat.subcategories.map((sub: Subcategory) => sub)
          );
          setSubCategoriesAll(allSubcategories);
        } else {
          console.warn("No se encontraron categorías con subcategorías.");
        }
      } catch (error) {
        console.error("Error al obtener las categorías:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const onSubmit = async (values: FormPost) => {
    // Validar que el contenido no esté vacío
    const contenSanitized = DOMPurify.sanitize(content, {
      ALLOWED_TAGS: [],
    });

    if (!content || content.trim() === "" || contenSanitized.trim() === "") {
      setErrorMessage("El contenido es obligatorio");
      return;
    }
    toast.loading("Guardando post...");

    try {
      setIsSubmitting(true);
      const urlImage = await uploadImageToS3(
        values.image[0],
        values.image[0].type
      );
      console.log("URL de la imagen:", urlImage);
      const data = {
        title: values.title,
        categoryId: Number(values.category),
        subcategoryId: Number(values.subcategory),
        content: content.trim(),
        published: values.isPublished,
        image: urlImage,
      };
      await saveNewPost(data);
      toast.dismiss();
      toast.success("Post guardado exitosamente");
    } catch (error) {
      let errorMessage = "Error al guardar el post";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      }
      toast.dismiss();
      toast.error(errorMessage);
    } finally {
      setImagePreview("");
      formPost.reset();
      setContent("");
      setErrorMessage(null);
      setIsSubmitting(false);
    }
  };
  return (
    <div className="min-h-screen  p-4 sm:p-6 md:p-8">
      <div className="conatainer  max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold font-[family-name:var(--font-cormorant-garamond)]">
            Crear Nuevo Post
          </h1>
          <p className="mt-1 text-sm text-gray-400">
            Comparte tus ideas con el mundo
          </p>
        </div>

        <Form {...formPost}>
          <form
            onSubmit={formPost.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <Card className=" shadow-sm">
              <CardHeader>
                <CardTitle>Información del Post</CardTitle>
              </CardHeader>

              <CardContent className="space-y-6">
                <FormField
                  control={formPost.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Escribe un título atractivo"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Categoría y Subcategoría */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <FormField
                      control={formPost.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Categoría</FormLabel>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                            }}
                            defaultValue={field.value}
                            {...field}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue
                                  placeholder={
                                    isLoading
                                      ? "Cargando categorías..."
                                      : "Selecciona una categoría"
                                  }
                                />
                              </SelectTrigger>
                            </FormControl>
                            <FormMessage />

                            <SelectContent>
                              {isLoading
                                ? Array.from({ length: 4 }).map((_, idx) => (
                                    <div
                                      key={idx}
                                      className="h-8 w-full bg-slate-200 rounded-md animate-pulse mb-2"
                                    />
                                  ))
                                : categories.map((category) => (
                                    <SelectItem
                                      key={category.id}
                                      value={category.id.toString()}
                                      className="capitalize"
                                    >
                                      {category.name}
                                    </SelectItem>
                                  ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <FormField
                      control={formPost.control}
                      name="subcategory"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subcategoría</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={!formPost.watch("category")}
                            {...field}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Selecciona una subcategoría" />
                              </SelectTrigger>
                            </FormControl>

                            <FormMessage />

                            <SelectContent>
                              {subcategories.map((sub) => {
                                return (
                                  <SelectItem
                                    key={sub.id}
                                    value={sub.id.toString()}
                                    className="capitalize"
                                  >
                                    {sub.name}
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Editor de Contenido */}

                <FormItem>
                  <FormLabel className={errorMessage ? "text-destructive" : ""}>
                    Contenido
                  </FormLabel>
                  <FormControl>
                    <RichTextEditor
                      key={`editor-${content ? "has-content" : "empty"}`}
                      content={content}
                      onChange={(val) => {
                        setContent(val);
                        if (errorMessage && val.trim()) setErrorMessage(null);
                      }}
                    />
                  </FormControl>
                  {errorMessage && <FormMessage>{errorMessage}</FormMessage>}
                </FormItem>

                {/* Imagen del post  */}
                <FormField
                  control={formPost.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel> Imagen destacada</FormLabel>
                      <FormControl>
                        {!imagePreview ? (
                          <div className="border-2 flex flex-col justify-center min-h-[500px]  relative  border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors">
                            <Input
                              type="file"
                              accept="image/*"
                              id="image"
                              aria-describedby="image-description"
                              // Remove value prop, handle file input manually
                              onChange={(e) => {
                                field.onChange(e.target.files);
                                // Crear preview
                                const reader = new FileReader();
                                reader.onload = (e) => {
                                  setImagePreview(e.target?.result as string);
                                };
                                if (e.target.files && e.target.files[0]) {
                                  reader.readAsDataURL(e.target.files[0]);
                                }
                              }}
                              onBlur={field.onBlur}
                              ref={field.ref}
                              name={field.name}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div className="flex items-center justify-center space-x-4">
                              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                                <svg
                                  className="w-6 h-6 text-slate-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                  />
                                </svg>
                              </div>
                            </div>

                            <div>
                              <p className="text-sm font-medium text-slate-600">
                                Haz clic para subir una imagen
                              </p>
                              <p className="text-xs text-slate-400">
                                PNG, JPG, GIF hasta 5MB
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="relative w-full h-80  rounded-lg overflow-hidden">
                            <Image
                              src={imagePreview}
                              alt="Vista previa"
                              fill
                              style={{
                                objectPosition: "49.1825% 67.865%",
                                objectFit: "cover",
                              }}
                              unoptimized
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center opacity-0 hover:opacity-60">
                              <div className="flex space-x-2">
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => {
                                    setImagePreview("");
                                    formPost.resetField("image");
                                  }}
                                >
                                  Eliminar
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Estado de Publicación */}
                <div className="flex items-center justify-between rounded-lg border-slate-200 focus:border-teal-500">
                  <div>
                    <h3 className="font-medium text-muted-foreground">
                      Estado de publicación
                    </h3>
                    <p className="text-sm text-gray-400">
                      {formPost.watch("isPublished")
                        ? "Tu post será visible para todos"
                        : "Tu post se guardará como borrador"}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <FormField
                      control={formPost.control}
                      name="isPublished"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormLabel htmlFor="isPublished">
                            {field.value ? "Publicado" : "Borrador"}
                          </FormLabel>
                          <FormControl>
                            <Switch
                              id="isPublished"
                              checked={field.value}
                              onCheckedChange={(checked) => {
                                field.onChange(checked);
                              }}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    ></FormField>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex justify-end border-t border-border pt-6">
                <div className="flex space-x-2">
                  <Link href="/dashboard">
                    <Button
                      type="button"
                      variant="outline"
                      className="border-primary hover:border-primary hover:bg-transparent hover:text-slate-800 dark:hover:text-slate-200 dark:border-primary/70 dark:hover:bg-primary/20"
                    >
                      Cancelar
                    </Button>
                  </Link>

                  <Button type="submit" disabled={isSubmitting}>
                    <Save className="h-4 w-4 mr-2" />
                    {formPost.watch("isPublished")
                      ? "Publicar"
                      : "Guardar borrador"}
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </form>
        </Form>
      </div>
    </div>
  );
}
