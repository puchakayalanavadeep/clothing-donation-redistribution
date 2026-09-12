const cloudinary = require('../config/cloudinary');

// @desc    Upload multiple clothing images
// @route   POST /api/upload
// @access  Private / Public
exports.uploadImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      // Fallback sample URLs if no file attached
      return res.status(200).json({
        success: true,
        message: 'Image upload processed.',
        urls: [
          'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=800&auto=format&fit=crop'
        ]
      });
    }

    const uploadPromises = req.files.map((file) => {
      return new Promise((resolve, reject) => {
        if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_CLOUD_NAME !== 'demo_cloud') {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'circular_threads_donations' },
            (error, result) => {
              if (error) return reject(error);
              resolve(result.secure_url);
            }
          );
          stream.end(file.buffer);
        } else {
          // Convert buffer to data URI fallback
          const b64 = Buffer.from(file.buffer).toString('base64');
          const dataURI = `data:${file.mimetype};base64,${b64}`;
          resolve(dataURI);
        }
      });
    });

    const imageUrls = await Promise.all(uploadPromises);

    res.status(200).json({
      success: true,
      message: 'Images uploaded successfully.',
      urls: imageUrls
    });
  } catch (error) {
    next(error);
  }
};
