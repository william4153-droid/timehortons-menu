import CmsBody from "@/components/CmsBody";
import type { CmsPage } from "@/lib/types";

export default function StandardCmsPage({ page, eyebrow, fallbackH1, fallbackBody }: { page: CmsPage | null; eyebrow?: string; fallbackH1: string; fallbackBody: React.ReactNode }) {
  return <main><section className="state-hero"><div className="container">{eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}<h1>{page?.h1 || fallbackH1}</h1>{page?.excerpt ? <p className="hero-copy">{page.excerpt}</p> : null}</div></section><article className="container section prose">{page?.body ? <CmsBody body={page.body} /> : fallbackBody}</article></main>;
}
