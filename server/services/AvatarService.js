const sharp = require('sharp');
const uuidv4 = require('uuid/v4');
const util = require('util');
const path = require('path');
const fs = require('fs');

const fsunlink = util.promisify(fs.unlink);

class AvatarService {
  constructor(directory, cloudinary) {
    this.directory = directory;
    this.cloudinary = cloudinary;
  }

  async storeOld(buffer) {
    const filename = AvatarService.filename();
    const filepath = this.filepath(filename);

    await sharp(buffer)
      .resize(300, 300, {
        fit: sharp.fit.inside,
        withoutEnlargement: true,
      })
      .toFile(filepath);
    return filename;
  }

  async store(buffer) {
    // Upload
    const filename = AvatarService.filenameOnly();

    try {
      await this.cloudinary.uploader.upload(buffer.path, { public_id: filename });

      // Generate
      const url = this.cloudinary.url(filename, {
        width: 300,
        height: 300,
        crop: 'fit',
      });

      console.log(url);
      return url;
    } catch (err) {
      console.log(err.message);
      return null;
    }
  }

  async storeFeatureImage_old(buffer) {
    const filename = AvatarService.filename();
    const filepath = this.filepath(filename);

    await sharp(buffer)
      .resize(1947, 843, {
        fit: sharp.fit.inside,
        withoutEnlargement: true,
      })
      .toFile(filepath);
    return filename;
  }

  async storeFeatureImage(buffer) {
    // Upload

    const filename = AvatarService.filenameOnly();
    console.log(filename);

    try {
      const res = await this.cloudinary.uploader.upload(buffer.path, { public_id: filename });

      console.log('after upload');
      console.log(res);

      // res
      //   .then((data) => {
      //     console.log(data);
      //     console.log(data.secure_url);
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //   });

      // Generate
      // const url = this.cloudinary.url(filename);

      console.log(res.url);
      return res.url;
    } catch (err) {
      console.log(err.message);
      return null;
    }
  }

  async thumbnail(filename) {
    return sharp(this.filepath(filename)).resize(50, 50).toBuffer();
  }

  async delete(filename) {
    return fsunlink(this.filepath(filename));
  }

  static filename() {
    return `${uuidv4()}.png`;
  }

  static filenameOnly() {
    return `${uuidv4()}`;
  }

  filepath(filename) {
    return path.resolve(`${this.directory}/${filename}`);
  }
}

module.exports = AvatarService;
