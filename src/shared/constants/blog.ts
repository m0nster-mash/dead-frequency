/**
 * Blog post status and visibility options.
 */
export const BLOG_POST_STATUSES = ['DRAFT', 'PUBLISHED'] as const;
export type BlogPostStatus = (typeof BLOG_POST_STATUSES)[number];

export const BlogPostStatus = {
    DRAFT: 'DRAFT',
    PUBLISHED: 'PUBLISHED',
} as const;

export const BLOG_POST_STATUS_LABELS: Record<BlogPostStatus, string> = {
    [BlogPostStatus.DRAFT]: 'Draft',
    [BlogPostStatus.PUBLISHED]: 'Published',
};

export const BLOG_POST_VISIBILITIES = ['PUBLIC', 'SUBSCRIBERS_ONLY', 'PRIVATE'] as const;
export type BlogPostVisibility = (typeof BLOG_POST_VISIBILITIES)[number];

export const BlogPostVisibility = {
    PUBLIC: 'PUBLIC',
    SUBSCRIBERS_ONLY: 'SUBSCRIBERS_ONLY',
    PRIVATE: 'PRIVATE',
} as const;

export const BLOG_POST_VISIBILITY_LABELS: Record<BlogPostVisibility, string> = {
    [BlogPostVisibility.PUBLIC]: 'Public',
    [BlogPostVisibility.SUBSCRIBERS_ONLY]: 'Subscribers Only',
    [BlogPostVisibility.PRIVATE]: 'Private',
};
