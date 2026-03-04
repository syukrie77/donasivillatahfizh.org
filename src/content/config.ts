import { z, defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

const updatesCollection = defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/content/updates" }),
    schema: z.object({
        title: z.string(),
        date: z.date(),
        image: z.string().optional(),
        description: z.string()
    })
});

const testimoniCollection = defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/content/testimoni" }),
    schema: z.object({
        name: z.string(),
        role: z.string(),
        quote: z.string(),
        rating: z.number().default(5)
    })
});

const faqCollection = defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/content/faq" }),
    schema: z.object({
        question: z.string(),
        answer: z.string(),
        order: z.number().default(0)
    })
});

export const collections = {
    'updates': updatesCollection,
    'testimoni': testimoniCollection,
    'faq': faqCollection,
};
