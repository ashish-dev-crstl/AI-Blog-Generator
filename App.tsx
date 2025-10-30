
import React, { useState, useCallback } from 'react';
import { generateBlogPost } from './services/geminiService';
import { BlogPost } from './types';
import Loader from './components/Loader';
import SeoHeadPreview from './components/SeoHeadPreview';
import BlogContentPreview from './components/BlogContentPreview';

const App: React.FC = () => {
  const [topic, setTopic] = useState<string>('How to bake sourdough bread');
  const [keywords, setKeywords] = useState<string>('sourdough, baking, homemade bread, starter');
  const [audience, setAudience] = useState<string>('Beginner bakers');
  const [tone, setTone] = useState<string>('Friendly and encouraging');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedPost, setGeneratedPost] = useState<BlogPost | null>(null);

  const handleGeneratePost = useCallback(async () => {
    if (!topic) {
      setError('Please provide a topic for the blog post.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedPost(null);

    try {
      const post = await generateBlogPost(topic, keywords, audience, tone);
      setGeneratedPost(post);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [topic, keywords, audience, tone]);
  
  const InputField: React.FC<{ label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder: string }> = ({ label, value, onChange, placeholder }) => (
      <div>
          <label className="block mb-2 text-sm font-medium text-gray-300">{label}</label>
          <input
              type="text"
              value={value}
              onChange={onChange}
              placeholder={placeholder}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
          />
      </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans p-4 sm:p-6 md:p-8">
      <main className="max-w-7xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300">
            AI SEO Blog Post Generator
          </h1>
          <p className="mt-4 text-lg text-gray-400">
            Turn a simple topic into a fully-fledged, SEO-optimized blog post with one click.
          </p>
        </header>

        <div className="bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField label="Blog Post Topic" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g., The Future of Renewable Energy" />
              <InputField label="Target Keywords (comma-separated)" value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="e.g., solar, wind, geothermal" />
              <InputField label="Target Audience" value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="e.g., Tech enthusiasts" />
              <InputField label="Tone of Voice" value={tone} onChange={(e) => setTone(e.target.value)} placeholder="e.g., Professional and informative" />
          </div>
          <div className="mt-8 text-center">
            <button
              onClick={handleGeneratePost}
              disabled={isLoading}
              className="px-8 py-3 font-bold text-white bg-sky-600 rounded-lg hover:bg-sky-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-transform transform hover:scale-105 shadow-lg"
            >
              {isLoading ? 'Generating...' : '✨ Generate Blog Post'}
            </button>
          </div>
        </div>
        
        {error && (
            <div className="mt-8 bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg text-center">
                <strong>Error:</strong> {error}
            </div>
        )}

        <div className="mt-12">
          {isLoading && <Loader />}
          {generatedPost && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <SeoHeadPreview post={generatedPost} siteUrl="https://yourwebsite.com" />
                  <div className="flex flex-col">
                      <h3 className="text-xl font-bold text-sky-400 mb-4">Social Share Preview</h3>
                      <div className="bg-gray-800 rounded-lg shadow-lg p-4 flex-grow">
                          <img src={generatedPost.generatedImageDataUrl || generatedPost.ogImage} alt="Social share preview" className="w-full h-auto object-cover rounded-t-md" />
                          <div className="p-4 bg-gray-700 rounded-b-md">
                              <p className="text-xs uppercase text-gray-400">YOURWEBSITE.COM</p>
                              <h4 className="font-bold text-lg text-white truncate">{generatedPost.ogTitle}</h4>
                              <p className="text-sm text-gray-300 line-clamp-2">{generatedPost.ogDescription}</p>
                          </div>
                      </div>
                  </div>
              </div>
              <BlogContentPreview post={generatedPost} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
