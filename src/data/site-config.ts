export type SocialLink = {
  platform: string;
  url: string;
};

export type Profile = {
  name: string;
  title: string;
  slogan: string;
  email: string;
  tags: string[];
  socials: SocialLink[];
  avatarUrl?: string;
  showGallery?: boolean;
};

export type NewsItem = {
  id: number;
  date: string;
  emoji: string;
  title: string;
  summary: string;
  source: string;
  url: string;
  contentMd: string;
  contentHtml?: string;
  publishedAt?: string;
};

export type GalleryItem = {
  id: number;
  title: string;
  imageUrl: string;
  tag: string;
  color: string;
  prompt: string;
};

export type SiteConfig = {
  profile: Profile;
  news: NewsItem[];
  gallery: GalleryItem[];
};
