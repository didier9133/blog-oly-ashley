"use client";

import { useEffect, useMemo, useState, useRef, useCallback } from "react";
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
import { Textarea } from "@/components/ui/textarea";
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
  saveNewPost,
} from "@/app/[locale]/actions/posts";
import { Subcategory, Category } from "@prisma/client";
import RichTextEditor from "@/components/rich-text-editor";
import { uploadImageToS3 } from "@/app/[locale]/actions/images";
import DOMPurify from "isomorphic-dompurify";
import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  getImageDimensions,
  isAllowedOgImageFile,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_MAX_SIZE,
  OG_IMAGE_MAX_SIZE_MB,
  OG_IMAGE_WIDTH,
} from "@/lib/og-image-validation";

const VIDEO_SIZE_LIMIT = 100 * 1024 * 1024; // 100MB
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/ogg"];

interface PresignedVideoUploadResponse {
  uploadUrl: string;
  fileUrl: string;
}

type TFn = (
  key: string,
  values?: Record<string, string | number | Date>,
) => string;

type PresignedVideoUploadErrors = {
  prepareFailed: string;
  invalidResponse: string;
  uploadFailed: string;
};

async function uploadVideoViaPresignedUrl(
  file: File,
  errors: PresignedVideoUploadErrors,
): Promise<string> {
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
    throw new Error(errors.prepareFailed);
  }

  const { uploadUrl, fileUrl } =
    (await presignResponse.json()) as PresignedVideoUploadResponse;

  if (!uploadUrl || !fileUrl) {
    throw new Error(errors.invalidResponse);
  }

  const uploadResponse = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type || "application/octet-stream",
    },
    body: file,
  });

  if (!uploadResponse.ok) {
    throw new Error(errors.uploadFailed);
  }

  return fileUrl;
}

function buildFormPostSchema(t: TFn) {
  return z.object({
    title_en: z
      .string()
      .min(1, t("validation.titleRequired"))
      .max(100, t("validation.titleMax", { max: 100 })),
    title_es: z
      .string()
      .min(1, t("validation.titleRequired"))
      .max(100, t("validation.titleMax", { max: 100 })),

    category: z.string().min(1, t("validation.categoryRequired")),

    subcategory: z.string().min(1, t("validation.subcategoryRequired")),

    isPublished: z.boolean(),

    image: z.lazy(() =>
      typeof window !== "undefined"
        ? z.any().superRefine(async (files, ctx) => {
            if (!(files instanceof FileList)) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: t("validation.imageRequired"),
              });
              return;
            }

            if (files.length === 0) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: t("validation.imageRequired"),
              });
              return;
            }

            const file = files[0];

            if (file.size > OG_IMAGE_MAX_SIZE) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: t("validation.imageMaxSize", {
                  maxMb: OG_IMAGE_MAX_SIZE_MB,
                }),
              });
              return;
            }

            if (!isAllowedOgImageFile(file)) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: t("validation.imageInvalidFormat"),
              });
              return;
            }

            try {
              const dimensions = await getImageDimensions(file);

              if (
                dimensions.width !== OG_IMAGE_WIDTH ||
                dimensions.height !== OG_IMAGE_HEIGHT
              ) {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  message: t("validation.imageInvalidDimensions", {
                    width: OG_IMAGE_WIDTH,
                    height: OG_IMAGE_HEIGHT,
                  }),
                });
              }
            } catch {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: t("validation.imageUnreadable"),
              });
            }
          })
        : z.any(),
    ),
    video: z
      .lazy(() =>
        typeof window !== "undefined"
          ? z.any().superRefine((files, ctx) => {
              if (
                files === undefined ||
                files === null ||
                (files instanceof FileList && files.length === 0)
              ) {
                return;
              }

              if (typeof files === "string") {
                return;
              }

              if (!(files instanceof FileList)) {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  message: t("validation.videoInvalidFile"),
                });
                return;
              }

              const file = files[0];

              if (file.size > VIDEO_SIZE_LIMIT) {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  message: t("validation.videoMaxSize", { maxMb: 100 }),
                });
              }

              if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  message: t("validation.videoInvalidFormat"),
                });
              }
            })
          : z.any(),
      )
      .optional(),
  });
}

type FormPost = z.infer<ReturnType<typeof buildFormPostSchema>>;
interface CategoryWithSub extends Category {
  subcategories: Subcategory[];
}

export default function CreatePostPage() {
  const t = useTranslations("dashboard.postForm");
  const formPostSchema = useMemo(() => buildFormPostSchema(t), [t]);
  const videoUploadErrors: PresignedVideoUploadErrors = useMemo(
    () => ({
      prepareFailed: t("video.errors.prepareFailed"),
      invalidResponse: t("video.errors.invalidResponse"),
      uploadFailed: t("video.errors.uploadFailed"),
    }),
    [t],
  );

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

  // Recipe SEO fields (shown only when "recipes" category is selected)
  const [recipeIngredients, setRecipeIngredients] = useState("");
  const [recipeInstructions, setRecipeInstructions] = useState("");
  const [recipeYield, setRecipeYield] = useState("");
  const [recipePrepTime, setRecipePrepTime] = useState("");
  const [recipeCookTime, setRecipeCookTime] = useState("");

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
      fieldOnChange: (value: string) => void,
    ) => {
      e.preventDefault();
      const pastedText = e.clipboardData.getData("text/plain");
      const sanitizedText = sanitizePastedText(pastedText);
      fieldOnChange(sanitizedText.slice(0, 100));
    },
    [sanitizePastedText],
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
      title_es: "",
      title_en: "",
      category: "",
      subcategory: "",
      isPublished: false,
      video: undefined,
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
            (sub) => sub.categoryId === Number(value.category),
          ),
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
              cat.subcategories.map((sub: Subcategory) => sub),
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
    const isRecipePost =
      categories.find((c) => c.id.toString() === values.category)?.name ===
      "recipes";

    // Validar que el contenido no esté vacío
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
      setErrorMessage_en(t("validation.contentRequired"));
      return;
    }

    if (
      !content_es ||
      content_es.trim() === "" ||
      contenSanitized_es.trim() === ""
    ) {
      setErrorMessage_es(t("validation.contentRequired"));
      return;
    }

    toast.loading(t("toast.create.loading"));

    try {
      setIsSubmitting(true);
      const urlImage = await uploadImageToS3(
        values.image[0],
        values.image[0].type,
      );
      let videoUrl: string | null = null;

      if (values.video instanceof FileList && values.video.length > 0) {
        videoUrl = await uploadVideoViaPresignedUrl(
          values.video[0],
          videoUploadErrors,
        );
      }
      console.log("URL de la imagen:", urlImage);
      const data = {
        title_es: values.title_es.trim(),
        title_en: values.title_en.trim(),
        categoryId: Number(values.category),
        subcategoryId: Number(values.subcategory),
        content_es: content_es.trim(),
        content_en: content_en.trim(),
        published: values.isPublished,
        image: urlImage,
        video: videoUrl,
        ...(isRecipePost && {
          recipeIngredients: recipeIngredients
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean),
          recipeInstructions: recipeInstructions
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean),
          recipeYield: recipeYield.trim() || null,
          recipePrepTime: recipePrepTime.trim() || null,
          recipeCookTime: recipeCookTime.trim() || null,
        }),
      };
      await saveNewPost(data);
      toast.dismiss();
      toast.success(t("toast.create.success"));
    } catch (error) {
      let errorMessage = t("toast.create.error");
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      }
      toast.dismiss();
      toast.error(errorMessage);
    } finally {
      setImagePreview("");
      setVideoPreview("");
      formPost.reset();

      setContent_es("");
      setContent_en("");
      setRecipeIngredients("");
      setRecipeInstructions("");
      setRecipeYield("");
      setRecipePrepTime("");
      setRecipeCookTime("");
      setErrorMessage_en(null);
      setErrorMessage_es(null);
      setIsSubmitting(false);
    }
  };
  const watchedCategoryId = formPost.watch("category");
  const isRecipePostVisible =
    categories.find((c) => c.id.toString() === watchedCategoryId)?.name ===
    "recipes";

  return (
    <div className="min-h-screen  p-4 sm:p-6 md:p-8">
      <div className="conatainer  max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold font-[family-name:var(--font-cormorant-garamond)]">
            {t("create.title")}
          </h1>
          <p className="mt-1 text-sm text-gray-400">{t("create.subtitle")}</p>
        </div>

        <Form {...formPost}>
          <form
            onSubmit={formPost.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <Card className=" shadow-sm">
              <CardHeader>
                <CardTitle>{t("card.postInfo")}</CardTitle>
              </CardHeader>

              <CardContent className="space-y-6">
                <FormField
                  control={formPost.control}
                  name="title_es"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("fields.titleEs.label")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("fields.title.placeholder")}
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
                      <FormLabel>{t("fields.titleEn.label")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("fields.title.placeholder")}
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
                          <FormLabel>{t("fields.category.label")}</FormLabel>
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
                                      ? t("fields.category.loading")
                                      : t("fields.category.placeholder")
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
                          <FormLabel>{t("fields.subcategory.label")}</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={!formPost.watch("category")}
                            {...field}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue
                                  placeholder={t(
                                    "fields.subcategory.placeholder",
                                  )}
                                />
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
                    {t("fields.contentEn.label")}
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
                    {t("fields.contentEs.label")}
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
                      <FormLabel>{t("fields.image.label")}</FormLabel>
                      <FormControl>
                        {!imagePreview ? (
                          <div className="border-2 flex flex-col justify-center min-h-[500px]  relative  border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors">
                            <Input
                              type="file"
                              accept="image/jpeg"
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
                                {t("fields.image.uploadPrompt")}
                              </p>
                              <p className="text-xs text-slate-400">
                                {t("fields.image.uploadHelp")}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="relative w-full h-80  rounded-lg overflow-hidden">
                            <Image
                              src={imagePreview}
                              alt={t("fields.image.previewAlt")}
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
                                  {t("actions.delete")}
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
                      <FormLabel>{t("fields.video.label")}</FormLabel>
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
                                  setVideoPreview(
                                    URL.createObjectURL(files[0]),
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
                                  {t("fields.video.uploadPrompt")}
                                </p>
                                <p className="text-xs text-slate-400">
                                  {t("fields.video.uploadHelp")}
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
                                    ? t("fields.video.preview.pause")
                                    : t("fields.video.preview.play")}
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
                                  setVideoPreview("");
                                  formPost.setValue("video", undefined);
                                  formPost.clearErrors("video");
                                  setIsVideoPreviewPlaying(true);
                                }}
                              >
                                {t("actions.delete")}
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
                    <h3 className="font-medium text-muted-foreground">
                      {t("fields.published.sectionTitle")}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {formPost.watch("isPublished")
                        ? t("fields.published.helpPublished")
                        : t("fields.published.helpDraft")}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <FormField
                      control={formPost.control}
                      name="isPublished"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormLabel htmlFor="isPublished">
                            {field.value
                              ? t("status.published")
                              : t("status.draft")}
                          </FormLabel>
                          <FormControl>
                            <Switch
                              id="isPublished"
                              checked={field.value}
                              onCheckedChange={(checked) => {
                                console.log("Switch checked:", checked);
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
                      {t("actions.cancel")}
                    </Button>
                  </Link>

                  <Button type="submit" disabled={isSubmitting}>
                    <Save className="h-4 w-4 mr-2" />
                    {formPost.watch("isPublished")
                      ? t("actions.publish")
                      : t("actions.saveDraft")}
                  </Button>
                </div>
              </CardFooter>
            </Card>

            {/* Recipe SEO fields — only shown when "recipes" category is selected */}
            {isRecipePostVisible && (
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Recipe Details (SEO Rich Results)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Ingredients (one per line)
                    </label>
                    <Textarea
                      value={recipeIngredients}
                      onChange={(e) => setRecipeIngredients(e.target.value)}
                      placeholder={"1 cup flour\n2 eggs\n1 tsp salt"}
                      rows={6}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Instructions (one step per line)
                    </label>
                    <Textarea
                      value={recipeInstructions}
                      onChange={(e) => setRecipeInstructions(e.target.value)}
                      placeholder={
                        "Mix dry ingredients\nAdd eggs and stir\nBake at 180°C for 30 min"
                      }
                      rows={6}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Yield</label>
                      <Input
                        value={recipeYield}
                        onChange={(e) => setRecipeYield(e.target.value)}
                        placeholder="4 servings"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Prep Time</label>
                      <Input
                        value={recipePrepTime}
                        onChange={(e) => setRecipePrepTime(e.target.value)}
                        placeholder="PT15M"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Cook Time</label>
                      <Input
                        value={recipeCookTime}
                        onChange={(e) => setRecipeCookTime(e.target.value)}
                        placeholder="PT30M"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
}
