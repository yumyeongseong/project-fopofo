const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const type = req.params.type;
    let folder;

    switch (type) {
      case 'image':
        folder = 'uploads/images';
        break;
      case 'video':
        folder = 'uploads/videos';
        break;
      case 'document':
        folder = 'uploads/documents';
        break;
      case 'design':
        folder = 'uploads/designs';
        break;
      default:
        folder = 'uploads/others';
    }

    cb(null, folder);
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

module.exports = upload;

