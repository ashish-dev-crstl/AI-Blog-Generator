
export interface BlogPost {
  title: string;
  metaDescription: string;
  keywords: string[];
  slug: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogType: string;
  twitterCard: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  blogContentMarkdown: string;
  generatedImageDataUrl?: string;
}
