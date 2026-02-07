/**
 * Cloudinary Upload Service
 * 
 * Credentials provided by user:
 * Cloud Name: du5lp8l8r
 * API Key: 839343154618125
 * 
 * NOTE: For client-side uploads, it is recommended to use "Unsigned Uploads" 
 * to avoid exposing the API Secret. 
 * Please ensure you have an unsigned upload preset named 'ml_default' 
 * (or update the constant below) in your Cloudinary Settings -> Upload.
 */

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/du5lp8l8r/image/upload";
const UPLOAD_PRESET = "ml_default"; // You might need to change this to your actual preset name

export const uploadToCloudinary = async (file) => {
    if (!file) return null;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    formData.append("cloud_name", "du5lp8l8r");

    try {
        const response = await fetch(CLOUDINARY_URL, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || "Cloudinary upload failed");
        }

        const data = await response.json();
        return data.secure_url;
    } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        throw error;
    }
};
