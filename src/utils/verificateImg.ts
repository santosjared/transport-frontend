const isImageURL = async (url: string) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
    });
};

export const isImage = async (url: string) => {
    try {
        const isImage = await isImageURL(url);
        return isImage;
    } catch (error) {
        return false;
    }
};