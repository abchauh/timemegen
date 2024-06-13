import { useState } from 'react';
import type { FC } from 'react';
import './XRaidPage.css';

export const XRaidPage: FC = () => {
  const [url, setUrl] = useState('');
  const [content, setContent] = useState<string | null>(null);

  const handleFetchContent = async () => {
    try {
      const response = await fetch(url);
      const data = await response.text();
      setContent(data);
    } catch (error) {
      setContent('Error fetching content.');
    }
  };

  return (
    <div className="x-raid-page">
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Paste X post URL here"
      />
      <button onClick={handleFetchContent}>Load Post</button>
      {content && (
        <div className="post-content">
          <h2>Post Content</h2>
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      )}
    </div>
  );
};
