
import React from 'react';
import { BlogPost } from '../types';
import CopyToClipboardButton from './CopyToClipboardButton';

interface SeoHeadPreviewProps {
    post: BlogPost;
    siteUrl: string;
}

const SeoHeadPreview: React.FC<SeoHeadPreviewProps> = ({ post, siteUrl }) => {
    const fullUrl = `${siteUrl}/${post.slug}`;
    const headContent = `
<!-- Primary Meta Tags -->
<title>${post.title}</title>
<meta name="title" content="${post.title}" />
<meta name="description" content="${post.metaDescription}" />
<meta name="keywords" content="${post.keywords.join(', ')}" />

<!-- Open Graph / Facebook -->
<meta property="og:type" content="${post.ogType}" />
<meta property="og:url" content="${fullUrl}" />
<meta property="og:title" content="${post.ogTitle}" />
<meta property="og:description" content="${post.ogDescription}" />
<meta property="og:image" content="${post.ogImage}" />

<!-- Twitter -->
<meta property="twitter:card" content="${post.twitterCard}" />
<meta property="twitter:url" content="${fullUrl}" />
<meta property="twitter:title" content="${post.twitterTitle}" />
<meta property="twitter:description" content="${post.twitterDescription}" />
<meta property="twitter:image" content="${post.twitterImage}" />
    `.trim();

    return (
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 relative">
            <h3 className="text-xl font-bold text-sky-400 mb-4">
                HTML &lt;head&gt; Code
            </h3>
            <p className="text-sm text-gray-400 mb-4">Copy this code into the &lt;head&gt; section of your blog post's HTML file.</p>
            <CopyToClipboardButton textToCopy={headContent} />
            <pre className="bg-gray-900 text-green-300 p-4 rounded-md overflow-x-auto text-sm">
                <code>
                    {headContent.split('\n').map((line, index) => (
                        <span key={index} className="block">{line}</span>
                    ))}
                </code>
            </pre>
        </div>
    );
};

export default SeoHeadPreview;
