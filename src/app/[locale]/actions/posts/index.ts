"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

type type = {
  categoryId: number;
};

export async function getCategoriesPosts() {
  try {
    const categories = await prisma.category.findMany({});
    if (!categories || categories.length === 0) {
      console.warn("No categories found.");
      return [];
    }

    return categories;
  } catch (error) {
    console.error("Error fetching categories posts:", error);
    return [];
  }
}

export async function getSubcategories(params: type) {
  const { categoryId } = params;
  try {
    const subcategories = await prisma.subcategory.findMany({
      where: { categoryId: categoryId },
    });
    if (!subcategories || subcategories.length === 0) {
      console.warn(`No subcategories found for category ID ${categoryId}.`);
      return [];
    }
    return subcategories;
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    return [];
  }
}

export async function deletePost(id: number) {
  try {
    const post = await prisma.post.delete({
      where: { id },
    });
    if (!post) {
      throw new Error(`Post with id ${id} not found`);
    }
    return revalidatePath("/dashboard");
  } catch (error) {
    console.error("Error deleting post:", error);
    throw new Error("Failed to delete post");
  }
}

export async function getPostById(id: number) {
  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        category: true,
        subcategory: true,
      },
    });
    if (!post) {
      throw new Error(`Post with id ${id} not found`);
    }
    return post;
  } catch (error) {
    console.error("Error fetching post by ID:", error);
    throw new Error("Failed to fetch post");
  }
}

export async function updatePost(
  postId: number,
  data: {
    title_es: string;
    title_en: string;

    content_es: string;
    content_en: string;

    image: string;
    categoryId: number;
    subcategoryId: number;
    published: boolean;
  }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("User not authenticated");
    }

    // First check if the post belongs to the current user
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post || post.authorId !== userId) {
      throw new Error(
        "Post not found or you don't have permission to update it"
      );
    }

    const newSlugEs = data
      .title_es!.toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 50);

    const newSlugEn = data
      .title_en!.toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 50);

    await prisma.post.update({
      where: { id: postId },
      data: {
        ...data,
        slug_es: newSlugEs !== post.slug_es ? newSlugEs : post.slug_es,
        slug_en: newSlugEn !== post.slug_en ? newSlugEn : post.slug_en,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/");
    return;
  } catch (error) {
    console.error("Error updating post:", error);
    throw new Error("Failed to update post");
  }
}

export async function getCategoriesWithSubcategories() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        subcategories: true,
      },
    });
    if (!categories || categories.length === 0) {
      console.warn("No categories with subcategories found.");
      return [];
    }
    return categories;
  } catch (error) {
    console.error("Error fetching categories with subcategories:", error);
    return [];
  }
}

export async function saveNewPost(data: {
  title_es: string;
  title_en: string;
  content_es: string;
  content_en: string;

  image: string;
  categoryId: number;
  subcategoryId: number;
  published: boolean;
}) {
  try {
    const { userId } = await auth();
    const slug_es = data.title_es
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 50);

    const slug_en = data.title_en
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 50);

    if (!userId) {
      throw new Error("User not authenticated");
    }
    const existingPost = await prisma.post.findFirst({
      where: {
        OR: [{ slug_es: slug_es }, { slug_en: slug_en }],
      },
    });
    if (existingPost) {
      throw new Error(`A post with the slug already exists.`);
    }

    const newPost = await prisma.post.create({
      data: {
        ...data,
        authorId: userId,
        slug_es: slug_es,
        slug_en: slug_en,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/");
    revalidatePath(`/blog/`);
    return newPost;
  } catch (error) {
    console.error("Error saving new post:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Failed to save new post");
  }
}
