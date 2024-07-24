import React, { useRef, useState } from 'react';
import default_image from '../assets/default.webp';
import './imageGenerator.css';

const ImageGenerator = () => {
    const [image_url, setImage_url] = useState("/");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const inputRef = useRef(null);

    const imageGenerator = async () => {
        if (inputRef.current.value === "") {
            return 0;
        }
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(process.env.REACT_APP_FETCH_LINK, {
                method: process.env.REACT_APP_METHOD,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${process.env.REACT_APP_API_KEY}`,
                    "User-Agent": "Chrome",
                },
                body: JSON.stringify({
                    prompt: `${inputRef.current.value}`,
                    n: 1,
                    size: "512x512",
                }),
            });
            const data = await response.json();
            const data_array = data.data;
            if (data_array === undefined) {
                setLoading(false);
                setError("Error generating image. Please try again.");
                return "error";
            } else {
                setImage_url(data_array[0].url);
            }
        } catch (error) {
            setLoading(false);
            setError("Error generating image. Please try again.");
            console.error("Error:", error);
        }
        setLoading(false);
    }

    return (
        <div className='imageGenerator'>
            <div className="header">Ai Image <span>Generator</span></div>
            <div className="img-loading">
                <div className="image">
                    <img src={image_url === "/" ? default_image : image_url} alt="" />
                </div>
                <div className="loading">
                    <div className={loading ? "loading-bar-full" : "loading-bar"}></div>
                    <div className={loading ? "loading-text" : "display-none"}>Loading....</div>
                </div>
            </div>
            <div className="search-box">
                <input type="text" ref={inputRef} className='search-input' placeholder='Describe What You Want To See' />
                <div className="generate-btn" onClick={imageGenerator}>Generate</div>
            </div>
            {error && <div style={{ color: 'red' }}>{error}</div>}
        </div>
    )
}

export default ImageGenerator;
