
import React from 'react';
import { BlogPost } from '../types';
import CopyToClipboardButton from './CopyToClipboardButton';

interface BlogContentPreviewProps {
    post: BlogPost;
}

const BlogContentPreview: React.FC<BlogContentPreviewProps> = ({ post }) => {
    const renderMarkdown = (markdown: string) => {
        return markdown.split('\n').map((line, index) => {
            if (line.startsWith('# ')) {
                return <h1 key={index} className="text-4xl font-bold mt-6 mb-4 text-white">{line.substring(2)}</h1>;
            }
            if (line.startsWith('## ')) {
                return <h2 key={index} className="text-3xl font-bold mt-6 mb-4 text-gray-100">{line.substring(3)}</h2>;
            }
            if (line.startsWith('### ')) {
                return <h3 key={index} className="text-2xl font-bold mt-5 mb-3 text-gray-200">{line.substring(4)}</h3>;
            }
            if (line.startsWith('* ')) {
                return <li key={index} className="ml-8 list-disc text-gray-300">{line.substring(2)}</li>;
            }
            if (line.trim() === '') {
                return <br key={index} />;
            }
            // Basic bold support with **text**
            const parts = line.split('**');
            return <p key={index} className="text-gray-300 leading-relaxed my-4">{
                parts.map((part, i) => i % 2 === 1 ? <strong key={i}>{part}</strong> : part)
            }</p>;
        });
    };

    return (
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 relative">
            <h3 className="text-xl font-bold text-sky-400 mb-4">
                Blog Content (Markdown)
            </h3>
             <p className="text-sm text-gray-400 mb-4">Copy the raw markdown for your CMS or convert to HTML.</p>
            <CopyToClipboardButton textToCopy={post.blogContentMarkdown} />
            <div className="prose prose-invert max-w-none bg-gray-900 p-6 rounded-md border border-gray-700">
                {renderMarkdown(post.blogContentMarkdown)}
            </div>
        </div>
    );
};

export default BlogContentPreview;
