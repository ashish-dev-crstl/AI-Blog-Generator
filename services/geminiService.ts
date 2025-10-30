
import { GoogleGenAI, Type } from "@google/genai";
import { BlogPost } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const blogPostSchema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: 'A compelling, SEO-friendly title for the blog post, under 60 characters.',
    },
    metaDescription: {
      type: Type.STRING,
      description: 'A concise and engaging meta description for SEO, under 160 characters.',
    },
    keywords: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'An array of 5-7 relevant SEO keywords for the blog post.',
    },
    slug: {
        type: Type.STRING,
        description: 'A URL-friendly slug for the blog post (e.g., "how-to-make-sourdough-bread").'
    },
    ogTitle: {
      type: Type.STRING,
      description: 'The title for Open Graph (og:title), usually the same as the main title.',
    },
    ogDescription: {
      type: Type.STRING,
      description: 'The description for Open Graph (og:description), usually the same as the meta description.',
    },
    ogImage: {
      type: Type.STRING,
      description: 'A descriptive, detailed prompt for an image for an AI image generator. The image should be suitable for the og:image tag, representing the blog post topic. For example: "A high-quality, photorealistic image of a golden-brown sourdough loaf on a rustic wooden table, with a dusting of flour and a bread knife next to it. The lighting is warm and inviting."'
    },
    ogType: {
      type: Type.STRING,
      description: 'The Open Graph type, which should be "article".',
    },
    twitterCard: {
      type: Type.STRING,
      description: 'The Twitter card type, which should be "summary_large_image".',
    },
    twitterTitle: {
      type: Type.STRING,
      description: 'The title for the Twitter card, same as the main title.',
    },
    twitterDescription: {
      type: Type.STRING,
      description: 'The description for the Twitter card, same as the meta description.',
    },
    twitterImage: {
        type: Type.STRING,
        description: 'A descriptive prompt for an image that would be suitable for the twitter:image tag, representing the blog post topic. Same as ogImage.'
    },
    blogContentMarkdown: {
      type: Type.STRING,
      description: 'The full blog post content in Markdown format. It should be well-structured with headings, paragraphs, lists, and bold text. It should be at least 500 words long.',
    },
  },
  required: ['title', 'metaDescription', 'keywords', 'slug', 'ogTitle', 'ogDescription', 'ogImage', 'ogType', 'twitterCard', 'twitterTitle', 'twitterDescription', 'twitterImage', 'blogContentMarkdown'],
};

export const generateBlogPost = async (
  topic: string,
  keywords: string,
  audience: string,
  tone: string
): Promise<BlogPost> => {
  const prompt = `
    Generate a complete, SEO-optimized blog post based on the following details.
    The response MUST be a valid JSON object that adheres to the provided schema.

    - **Topic:** ${topic}
    - **Target Keywords:** ${keywords}
    - **Target Audience:** ${audience}
    - **Tone of Voice:** ${tone}

    Create all required fields, including a full blog post in Markdown format. The ogImage and twitterImage should be a descriptive prompt for an image, not a URL.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: blogPostSchema,
      },
    });

    const jsonString = response.text;
    const blogPostData = JSON.parse(jsonString) as BlogPost;
    
    // Generate image based on the prompt in ogImage
    try {
        const imageResponse = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: blogPostData.ogImage, // Use the generated prompt
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/jpeg',
              aspectRatio: '16:9',
            },
        });
        
        if (imageResponse.generatedImages && imageResponse.generatedImages.length > 0) {
            const base64ImageBytes: string = imageResponse.generatedImages[0].image.imageBytes;
            blogPostData.generatedImageDataUrl = `data:image/jpeg;base64,${base64ImageBytes}`;
        }
    } catch (imageError) {
        console.error("Error generating image:", imageError);
        // Silently fail on image generation, the app will fall back to picsum
    }

    // Replace image prompts with placeholder URLs for the <head> code
    blogPostData.ogImage = `https://picsum.photos/seed/${encodeURIComponent(blogPostData.slug)}/1200/630`;
    blogPostData.twitterImage = `https://picsum.photos/seed/${encodeURIComponent(blogPostData.slug)}/1200/630`;
    
    return blogPostData;
  } catch (error) {
    console.error("Error generating blog post:", error);
    throw new Error("Failed to generate blog post from Gemini API. Please check your API key and the prompt.");
  }
};
