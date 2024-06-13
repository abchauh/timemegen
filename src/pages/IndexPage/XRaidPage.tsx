import type {FC} from 'react';
import {useState} from 'react';
import './XRaidPage.css';
import OverlayImage from '@/components/OverlayImage/OverlayImage';
import StickerPack from '@/components/StickerPack/StickerPack';

export const XRaidPage: FC = () => {
    const [url, setUrl] = useState('');
    const [content, setContent] = useState<any | null>(null);
    const [mediaUrl, setMediaUrl] = useState<string | null>(null);
    const [overlayImage, setOverlayImage] = useState<string | null>(null);

    const handleFetchContent = async () => {
        try {
            const tweetId = url.split('/').pop();
            if (!tweetId) {
                setContent('Invalid URL');
                return;
            }

            const response = await fetch(`https://react-tweet.vercel.app/api/tweet/${tweetId}`);
            const data = await response.json();

            if (data.data) {
                setContent(data.data.text);
                const media = data.data.mediaDetails?.[0]?.media_url_https;
                setMediaUrl(media || null);
            } else {
                setContent('Tweet not found');
                setMediaUrl(null);
            }
        } catch (error) {
            setContent('Error fetching content.');
            setMediaUrl(null);
        }
    };
    const handleStickerClick = (stickerDataUrl: string) => {
        setOverlayImage(stickerDataUrl);
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
                    <p>{content}</p>
                    {mediaUrl && (
                        <>
                            <OverlayImage mainImageSrc={mediaUrl} overlayImageSrc={overlayImage}/>
                            <StickerPack onStickerClick={handleStickerClick}/>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default XRaidPage;
