import type { Metadata } from "next";
import { notFound } from "next/navigation";
import StandardCmsPage from "@/components/StandardCmsPage";
import { getCmsPageByRoute } from "@/lib/cms";

export const revalidate = 300;

function pathFrom(slug: string[]) { return `/${slug.join("/")}`; }

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const { slug } = await params;
  const routePath = pathFrom(slug);
  const page = await getCmsPageByRoute(routePath);
  if (!page || page.page_type !== "custom") return {};
  return { title: page.meta_title, description: page.meta_description, alternates: { canonical: routePath }, robots: { index: page.robots_index, follow: true } };
}

export default async function CustomPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const page = await getCmsPageByRoute(pathFrom(slug));
  if (!page || page.page_type !== "custom") notFound();
  return <StandardCmsPage page={page} eyebrow="Guide" fallbackH1={page.h1} fallbackBody={null} />;
}
