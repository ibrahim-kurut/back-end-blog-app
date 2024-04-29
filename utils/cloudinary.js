const cloudinary = require('cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

// create function to cloudinary upload image
const cloudinaryUploadImage = async (fileToUpload) => {
    try {
        const date = await cloudinary.uploader.upload(fileToUpload, { resource_type: "auto" })
        return date
    } catch (error) {
        console.log(error);
        throw new Error("Internal Server Error (Cloudinary)")
    }
}

// create function to cloudinary remove image

const cloudinaryRemoveImage = async (imgPublicId) => {
    try {
        const result = await cloudinary.uploader.destroy(imgPublicId)
        return result
    } catch (error) {
        console.log(error);
        throw new Error("Internal Server Error (Cloudinary)")
    }
}

// create function to cloudinary remove multiple image

const cloudinaryRemoveMulipleImage = async (publicIds) => {
    try {
        const result = await cloudinary.v2.api.delete_resources(publicIds)
        return result
    } catch (error) {
        console.log(error);
        throw new Error("Internal Server Error (Cloudinary)")
    }
}
module.exports = {
    cloudinaryUploadImage,
    cloudinaryRemoveImage,
    cloudinaryRemoveMulipleImage
}