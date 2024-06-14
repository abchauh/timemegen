import {FC, ChangeEvent, useEffect} from 'react';
import {useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPaste} from '@fortawesome/free-solid-svg-icons';
import './XRaidPage.css';
import OverlayImage from '@/components/OverlayImage/OverlayImage';
import StickerPack from '@/components/StickerPack/StickerPack';
import {postEvent, on} from '@tma.js/sdk';

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

    const pasteText = async () => {
        try {
            const removeListener = on('clipboard_text_received', e => {
                if (e.data) {
                    setUrl(e.data);
                }
                removeListener();
            });
            postEvent('web_app_read_text_from_clipboard', {req_id: Date.now().toString()});
            const text = await navigator.clipboard.readText();
            setUrl(text);
        } catch (error) {
            console.error('Failed to read clipboard contents: ', error);
        }
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
                <button onClick={pasteText} aria-label="Paste from clipboard">
                    <FontAwesomeIcon icon={faPaste}/>
                </button>
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
