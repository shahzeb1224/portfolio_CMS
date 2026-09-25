import { Helmet } from 'react-helmet-async'
import { useData } from '@/hooks'
import { config } from '@/lib/config'

interface SeoProps {
  title?: string
  description?: string
  image?: string
  /** Path (e.g. "/projects/foo") or absolute URL for canonical + og:url. */
  path?: string
  type?: 'website' | 'article' | 'profile'
  noindex?: boolean
  keywords?: string[]
}

/**
 * Central SEO head manager. Falls back to site + profile defaults from the CMS,
 * so every page stays in sync with admin-editable settings.
 */
export function Seo({ title, description, image, path, type = 'website', noindex, keywords }: SeoProps) {
  const { settings, profile } = useData()
  const seo = settings.seo

  const fullTitle = title
    ? `${title} · ${settings.siteName}`
    : seo.metaTitle || `${profile.fullName} · ${profile.professionalTitle}`
  const desc = description || seo.metaDescription || profile.shortBio
  const ogImage = image || seo.ogImage || profile.avatar
  const kw = (keywords && keywords.length ? keywords : seo.keywords) ?? []
  const base = config.siteUrl?.replace(/\/$/, '') ?? ''
  const url = path?.startsWith('http') ? path : path ? `${base}${path}` : seo.canonicalUrl || base

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      {kw.length > 0 && <meta name="keywords" content={kw.join(', ')} />}
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      {url && <link rel="canonical" href={url} />}

      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      {ogImage && <meta property="og:image" content={ogImage} />}
      {url && <meta property="og:url" content={url} />}
      <meta property="og:site_name" content={settings.siteName} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}
    </Helmet>
  )
}
