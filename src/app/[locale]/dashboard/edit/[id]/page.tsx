"use client";

import { useEffect, useState, useRef, useCallback } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Save, Video, Pause, Play } from "lucide-react";
import { z } from "zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  getCategoriesWithSubcategories,
  getPostById,
  updatePost,
} from "@/app/[locale]/actions/posts";
import { Subcategory, Category } from "../../../generated/prisma/index";
import RichTextEditor from "@/components/rich-text-editor";
import { uploadImageToS3 } from "@/app/[locale]/actions/images";
import DOMPurify from "isomorphic-dompurify";
import Link from "next/link";
import { notFound, useParams, useRouter } from "next/navigation";

const FILE_SIZE_LIMIT = 5 * 1024 * 1024; // 5MB
const validExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"]; // Extensiones de archivo válidas
const VIDEO_SIZE_LIMIT = 100 * 1024 * 1024; // 100MB
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/ogg"];

interface PresignedVideoUploadResponse {
  uploadUrl: string;
  fileUrl: string;
}

async function uploadVideoViaPresignedUrl(file: File): Promise<string> {
  const presignResponse = await fetch("/api/upload/video", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: file.name,
      type: file.type || "application/octet-stream",
    }),
  });

  if (!presignResponse.ok) {
    throw new Error("No se pudo preparar la subida del video");
  }

  const { uploadUrl, fileUrl } =
    (await presignResponse.json()) as PresignedVideoUploadResponse;

  if (!uploadUrl || !fileUrl) {
    throw new Error("Respuesta inválida al preparar la subida del video");
  }

  const uploadResponse = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type || "application/octet-stream",
    },
    body: file,
  });

  if (!uploadResponse.ok) {
    throw new Error("Error al subir el video. Inténtalo nuevamente.");
  }

  return fileUrl;
}

const formPostSchema = z.object({
  title_en: z
    .string()
    .min(1, "El título es obligatorio")
    .max(100, "El título no puede exceder los 100 caracteres"),
  title_es: z
    .string()
    .min(1, "El título es obligatorio")
    .max(100, "El título no puede exceder los 100 caracteres"),

  category: z.string().min(1, "La categoría es obligatoria"),
  subcategory: z.string().min(1, "La subcategoría es obligatoria"),
  isPublished: z.boolean(),
  image: z.lazy(() =>
    typeof window !== "undefined"
      ? z.any().superRefine((val, ctx) => {
          // If it's a string URL
          if (typeof val === "string") {
            if (val.trim() === "") {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "La imagen es obligatoria",
              });
              return;
            }
            if (!val.includes("dgw9atod1ju2x.cloudfront.net")) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "URL de imagen no válida",
              });
              return;
            }
          }

          // If it's a FileList
          else if (val instanceof FileList) {
            if (val.length === 0) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "La imagen es obligatoria",
              });
              return;
            }
            if (val[0].size > FILE_SIZE_LIMIT) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Tamaño máximo de imagen 5MB",
              });
              return;
            }
          }

          // Verificar formato de archivo
          if (val instanceof FileList && val.length > 0) {
            const fileName = val[0].name.toLowerCase();

            const fileExtension = fileName.substring(fileName.lastIndexOf("."));

            if (!validExtensions.includes(fileExtension)) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Formato de imagen no compatible",
              });
              return;
            }
          }
        })
      : z.any()
  ),
  video: z
    .lazy(() =>
      typeof window !== "undefined"
        ? z.any().superRefine((val, ctx) => {
            if (
              val === undefined ||
              val === null ||
              val === "" ||
              (val instanceof FileList && val.length === 0)
            ) {
              return;
            }

            if (typeof val === "string") {
              return;
            }

            if (!(val instanceof FileList)) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Archivo de video no válido",
              });
              return;
            }

            const file = val[0];

            if (file.size > VIDEO_SIZE_LIMIT) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Tamaño máximo de video 100MB",
              });
            }

            if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Formato de video no válido (usa MP4, WEBM u OGG)",
              });
            }
          })
        : z.any()
    )
    .optional(),
});

type FormPost = z.infer<typeof formPostSchema>;
type FormPostWithContent = FormPost & {
  content_en: string;
  content_es: string;
  video: string | null;
};

interface CategoryWithSub extends Category {
  subcategories: Subcategory[];
}

export default function CreatePostPage() {
  const params = useParams<{ id: string }>();
  if (!params.id) notFound();

  // Estados para manejar las categorías y subcategorías
  const [subcategories, setSubcategories] = useState<
    { categoryId: number; name: string; id: number }[]
  >([]);
  const [categories, setCategories] = useState<CategoryWithSub[]>([]);
  const [subCategoriesAll, setSubCategoriesAll] = useState<Subcategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [videoPreview, setVideoPreview] = useState<string>("");
  const videoPreviewRef = useRef<HTMLVideoElement | null>(null);
  const [isVideoPreviewPlaying, setIsVideoPreviewPlaying] = useState(true);
  const [errorMessage_es, setErrorMessage_es] = useState<string | null>("");
  const [errorMessage_en, setErrorMessage_en] = useState<string | null>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [content_es, setContent_es] = useState("");
  const [content_en, setContent_en] = useState("");

  const sanitizePastedText = useCallback((text: string) => {
    // Remover HTML y mantener solo texto plano
    const cleanText = DOMPurify.sanitize(text, {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: [],
      KEEP_CONTENT: true,
    });

    // Remover saltos de línea y caracteres especiales problemáticos
    return cleanText
      .replace(/[\r\n]+/g, " ") // Reemplazar saltos de línea con espacios
      .replace(/\s+/g, " ") // Reemplazar múltiples espacios con uno solo
      .trim();
  }, []);

  const handleTitlePaste = useCallback(
    (
      e: React.ClipboardEvent<HTMLInputElement>,
      fieldOnChange: (value: string) => void
    ) => {
      e.preventDefault();
      const pastedText = e.clipboardData.getData("text/plain");
      const sanitizedText = sanitizePastedText(pastedText);
      fieldOnChange(sanitizedText.slice(0, 100));
    },
    [sanitizePastedText]
  );

  const toggleVideoPlayback = useCallback(() => {
    const videoElement = videoPreviewRef.current;
    if (!videoElement) return;

    if (isVideoPreviewPlaying) {
      videoElement.pause();
      setIsVideoPreviewPlaying(false);
      return;
    }

    const playPromise = videoElement.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsVideoPreviewPlaying(true);
        })
        .catch(() => {
          setIsVideoPreviewPlaying(false);
        });
    } else {
      setIsVideoPreviewPlaying(true);
    }
  }, [isVideoPreviewPlaying]);

  const formPost = useForm<FormPost>({
    resolver: zodResolver(formPostSchema),
    defaultValues: {
      title_en: "",
      title_es: "",
      category: "",
      subcategory: "",
      isPublished: false,
      video: "",
    },
  });

  // Guardar el valor anterior de la categoría
  const prevCategoryRef = useRef<string>("");

  const post = useRef<FormPostWithContent | null>(null);
  const isDeletedImage = useRef(false);
  const videoChangedRef = useRef(false); // Marca si el video fue reemplazado o eliminado

  const router = useRouter();

  useEffect(() => {
    const fetchPost = async () => {
      toast.loading("Cargando post...");
      try {
        const postData = await getPostById(Number(params.id));
        if (!postData) throw new Error("Post no encontrado");

        const videoValue =
          (postData as typeof postData & { video?: string | null }).video ??
          null;

        // Transform the response to match FormPost structure
        post.current = {
          title_en: postData.title_en,
          title_es: postData.title_es,
          category: postData.category.id.toString(),
          subcategory: postData.subcategory.id.toString(),
          isPublished: postData.published,
          content_en: postData.content_en || "", // Ensure content is always a string
          content_es: postData.content_es || "", // Ensure content is always a string
          video: videoValue,
        };

        // Primero, filtra las subcategorías basadas en la categoría del post
        const filteredSubcategories = subCategoriesAll.filter(
          (sub) => sub.categoryId === postData.category.id
        );

        // Actualiza el estado de subcategorías
        setSubcategories(filteredSubcategories);
        // Actualiza el valor anterior de categoría para evitar filtrados innecesarios
        prevCategoryRef.current = postData.category.id.toString();

        setTimeout(() => {
          formPost.reset({
            title_en: postData.title_en,
            title_es: postData.title_es,
            category: postData.category.id.toString(),
            subcategory: postData.subcategory.id.toString(),
            isPublished: postData.published,
            image: postData.image, // Set the image as a FileList
            video: videoValue ?? "",
          });
        }, 100); // Simula un pequeño retraso para la carga

        if (postData.content_en) {
          setContent_en(postData.content_en);
        }
        if (postData.content_es) {
          setContent_es(postData.content_es);
        }
        if (postData.image) {
          setImagePreview(postData.image);
        }
        setVideoPreview(videoValue ?? "");
        setIsVideoPreviewPlaying(Boolean(videoValue));
        videoChangedRef.current = false;
        toast.dismiss();
      } catch (error) {
        toast.dismiss();
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Error al cargar el post");
        }
        notFound();
      }
    };

    if (params.id && !isLoading && subCategoriesAll.length > 0) {
      fetchPost();
    }
  }, [params.id, formPost, isLoading, subCategoriesAll]);

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
        formPost.setValue("subcategory", ""); // Limpiar subcategoría
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [formPost, subCategoriesAll]);

  useEffect(() => {
    if (!videoPreview || !videoPreview.startsWith("blob:")) {
      return;
    }

    return () => {
      URL.revokeObjectURL(videoPreview);
    };
  }, [videoPreview]);

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
    const contenSanitized_es = DOMPurify.sanitize(content_es, {
      ALLOWED_TAGS: [],
    });

    const contenSanitized_en = DOMPurify.sanitize(content_en, {
      ALLOWED_TAGS: [],
    });

    if (
      !content_en ||
      content_en.trim() === "" ||
      contenSanitized_en.trim() === ""
    ) {
      setErrorMessage_en("El contenido es obligatorio");
      return;
    }

    if (
      !content_es ||
      content_es.trim() === "" ||
      contenSanitized_es.trim() === ""
    ) {
      setErrorMessage_es("El contenido es obligatorio");
      return;
    }

    // Check if data has changed before updating
    if (post.current) {
      const videoFieldValue = values.video;
      const hasVideoChanged =
        (videoFieldValue instanceof FileList && videoFieldValue.length > 0) ||
        videoChangedRef.current ||
        (typeof videoFieldValue === "string"
          ? post.current.video !==
            (videoFieldValue.trim() === "" ? null : videoFieldValue)
          : false);

      const hasChanged =
        post.current.title_en !== values.title_en ||
        post.current.title_es !== values.title_es ||
        post.current.category !== values.category ||
        post.current.subcategory !== values.subcategory ||
        post.current.content_en !== content_en ||
        post.current.content_es !== content_es ||
        post.current.isPublished !== values.isPublished ||
        isDeletedImage.current ||
        hasVideoChanged;

      if (!hasChanged) {
        toast.dismiss();
        toast.info("No hay cambios para guardar");
        return;
      }
    }
    toast.loading("Actualizando post...");
    setIsSubmitting(true);
    let urlImage = imagePreview;
    try {
      // Si se ha eliminado la imagen, no subir una nueva
      if (isDeletedImage.current) {
        urlImage = await uploadImageToS3(values.image[0], values.image[0].type);
        console.log("Imagen subida:", urlImage);
      }
      let videoUrl: string | null = post.current?.video ?? null;
      const videoValue = values.video;

      if (videoValue instanceof FileList && videoValue.length > 0) {
        videoUrl = await uploadVideoViaPresignedUrl(videoValue[0]);
      } else if (videoChangedRef.current) {
        videoUrl = null;
      } else if (typeof videoValue === "string" && videoValue.trim() !== "") {
        videoUrl = videoValue;
      }
      const data = {
        title_en: values.title_en,
        title_es: values.title_es,
        categoryId: Number(values.category),
        subcategoryId: Number(values.subcategory),
        content_en: content_en.trim(),
        content_es: content_es.trim(),
        published: values.isPublished,
        image: urlImage,
        video: videoUrl,
      };
      await updatePost(Number(params.id), data);
      toast.dismiss();
      toast.success("Post actualizado exitosamente");
      router.push("/dashboard");
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
      setIsSubmitting(false);
      isDeletedImage.current = false; // Reset after submission
      videoChangedRef.current = false;
    }
  };

  return (
    <div className="min-h-screen  p-4 sm:p-6 md:p-8">
      <div className="conatainer  max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold font-[family-name:var(--font-cormorant-garamond)]">
            Editar Post
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
            <Card className="ƒ shadow-sm">
              <CardHeader>
                <CardTitle>Información del Post</CardTitle>
              </CardHeader>

              <CardContent className="space-y-6">
                <FormField
                  control={formPost.control}
                  name="title_es"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título (ES)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Escribe un título atractivo"
                          {...field}
                          onPaste={(e) => handleTitlePaste(e, field.onChange)}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={formPost.control}
                  name="title_en"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título (EN)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Escribe un título atractivo"
                          {...field}
                          onPaste={(e) => handleTitlePaste(e, field.onChange)}
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
                  <FormLabel
                    className={errorMessage_en ? "text-destructive" : ""}
                  >
                    Contenido (EN)
                  </FormLabel>
                  <FormControl>
                    <RichTextEditor
                      key={`editor-${content_en ? "has-content" : "empty"}`}
                      content={content_en}
                      onChange={(val) => {
                        setContent_en(val);
                        if (errorMessage_en && val.trim())
                          setErrorMessage_en(null);
                      }}
                    />
                  </FormControl>
                  {errorMessage_en && (
                    <FormMessage>{errorMessage_en}</FormMessage>
                  )}
                </FormItem>

                <FormItem>
                  <FormLabel
                    className={errorMessage_es ? "text-destructive" : ""}
                  >
                    Contenido (ES)
                  </FormLabel>
                  <FormControl>
                    <RichTextEditor
                      key={`editor-${content_es ? "has-content" : "empty"}`}
                      content={content_es}
                      onChange={(val) => {
                        setContent_es(val);
                        if (errorMessage_es && val.trim())
                          setErrorMessage_es(null);
                      }}
                    />
                  </FormControl>
                  {errorMessage_es && (
                    <FormMessage>{errorMessage_es}</FormMessage>
                  )}
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
                                Tamaño máximo: 5MB. Formatos permitidos: JPG,
                                PNG, GIF, WebP o SVG.
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
                                    formPost.setValue("image", "");
                                    isDeletedImage.current = true;
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

                {/* Video opcional */}
                <FormField
                  control={formPost.control}
                  name="video"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Video (opcional)</FormLabel>
                      <FormControl>
                        {!videoPreview ? (
                          <div className="relative w-full aspect-video border-2 border-dashed border-border rounded-lg text-center hover:border-primary transition-colors">
                            <Input
                              type="file"
                              accept={ALLOWED_VIDEO_TYPES.join(",")}
                              id="video"
                              aria-describedby="video-description"
                              onChange={(e) => {
                                const { files } = e.target;
                                field.onChange(files);
                                if (files && files[0]) {
                                  videoChangedRef.current = true;
                                  setVideoPreview(
                                    URL.createObjectURL(files[0])
                                  );
                                  setIsVideoPreviewPlaying(true);
                                } else {
                                  setVideoPreview("");
                                  setIsVideoPreviewPlaying(true);
                                }
                              }}
                              onBlur={field.onBlur}
                              name={field.name}
                              ref={field.ref}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div className="flex flex-col items-center justify-center gap-2 h-full w-full px-4">
                              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                                <Video className="w-6 h-6 text-slate-400" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-slate-600">
                                  Haz clic para subir un video
                                </p>
                                <p className="text-xs text-slate-400">
                                  MP4, WEBM u OGG hasta 100MB
                                </p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="group relative w-full aspect-video rounded-lg overflow-hidden bg-black">
                            <video
                              className="absolute inset-0 h-full w-full object-cover"
                              src={videoPreview}
                              autoPlay
                              muted
                              loop
                              playsInline
                              preload="metadata"
                              ref={videoPreviewRef}
                              onPlay={() => setIsVideoPreviewPlaying(true)}
                              onPause={() => setIsVideoPreviewPlaying(false)}
                            />
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                              <Button
                                type="button"
                                size="icon"
                                variant="ghost"
                                className="pointer-events-auto rounded-full bg-black/60 text-white hover:bg-black/70"
                                onClick={toggleVideoPlayback}
                              >
                                {isVideoPreviewPlaying ? (
                                  <Pause className="h-5 w-5" />
                                ) : (
                                  <Play className="h-5 w-5" />
                                )}
                                <span className="sr-only">
                                  {isVideoPreviewPlaying
                                    ? "Pausar vista previa del video"
                                    : "Reproducir vista previa del video"}
                                </span>
                              </Button>
                            </div>
                            <div className="absolute inset-0 z-10 pointer-events-none">
                              <div className="absolute inset-0 bg-black/0 opacity-0 transition-all duration-200 group-hover:bg-black/40 group-hover:opacity-100" />
                            </div>
                            <div className="absolute top-3 right-3 z-30 hidden group-hover:flex">
                              <Button
                                type="button"
                                size="sm"
                                variant="destructive"
                                onClick={() => {
                                  videoChangedRef.current = true;
                                  setVideoPreview("");
                                  formPost.setValue("video", undefined);
                                  formPost.clearErrors("video");
                                  setIsVideoPreviewPlaying(true);
                                }}
                              >
                                Eliminar
                              </Button>
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
                    <h3 className="font-medium ">Estado de publicación</h3>
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
                    Guardar
                  </Button>
                  <span>{isDeletedImage.current}</span>
                </div>
              </CardFooter>
            </Card>
          </form>
        </Form>
      </div>
    </div>
  );
}
