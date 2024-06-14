import {ChangeEvent, FC, useEffect, useState} from 'react';
import './XRaidPage.css';
import OverlayImage from '@/components/OverlayImage/OverlayImage';
import StickerPack from '@/components/StickerPack/StickerPack';

export const XRaidPage: FC = () => {
    const [url, setUrl] = useState('');
    const [content, setContent] = useState<string | null>(null);
    const [mediaUrl, setMediaUrl] = useState<string | null>(null);
    const [overlayImage, setOverlayImage] = useState<string | null>(null);

    useEffect(() => {
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
        if (url) {
            handleFetchContent();
        }
    }, [url]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setUrl(e.target.value);
    };

    return (
        <div className="x-raid-page">
            <div className="input-group">
                <input
                    type="text"
                    value={url}
                    onChange={handleInputChange}
                    placeholder="Paste X post URL here"
                />
            </div>
            {content && (<div className="post-content">
                <p>{content}</p>
                {mediaUrl && (
                    <>
                        <OverlayImage mainImageSrc={mediaUrl} overlayImageSrc={overlayImage}/>
                        <StickerPack onStickerClick={setOverlayImage}/>
                    </>
                )}
            </div>)}
        </div>
    );
};

export default XRaidPage;
