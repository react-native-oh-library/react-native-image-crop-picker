import fs from '@ohos.file.fs';
import image from '@ohos.multimedia.image';
import { Constants } from '../utils/Constants';
import { photoAccessHelper } from '@kit.MediaLibraryKit';
import { fileIo } from '@kit.CoreFileKit'


const TAG: string = 'imageCrop_Decode_Encode';

/**
 * Async create pixel map.
 *
 * @return pixelMa.
 */
export async function getPixelMap(uri: string){

  const file = fs.openSync(uri, fs.OpenMode.READ_ONLY);
  console.log('imageEdit_Decode file:', JSON.stringify(file))
  const fd = file?.fd;
  console.log('imageEdit_Decode fd:', JSON.stringify(fd))
  // path为已获得的沙箱路径
  const imageSource = image.createImageSource(fd);
  console.log('imageEdit_Decode imageSource:', JSON.stringify(imageSource))
  const pixelMap = await imageSource.createPixelMap({
    editable: true
  });
  return pixelMap
}

export async function encode(component: Object, pixelMap: PixelMap) {
  const newPixelMap = pixelMap;
  // Packing image.
  const imagePackerApi = image.createImagePacker();
  const packOptions: image.PackingOption = {
    format: Constants.ENCODE_FORMAT,
    quality: Constants.ENCODE_QUALITY
  }
  const imageData = await imagePackerApi.packing(newPixelMap, packOptions);
  // Get album's path.
  const context = getContext(component);
  console.log(TAG,'context---',JSON.stringify(context))
  const media = photoAccessHelper.getPhotoAccessHelper(context);
  console.log(TAG,'media---',JSON.stringify(media))
  const currentTime = new Date().getTime();
  // Create image asset.
  const filePath = await media.createAsset(
    photoAccessHelper.PhotoType.IMAGE,
    `${Constants.IMAGE_PREFIX}_${currentTime}${Constants.IMAGE_FORMAT}`,
  );

  let file = fileIo.openSync(filePath, fileIo.OpenMode.CREATE | fileIo.OpenMode.READ_WRITE)
  await fs.write(file.fd, imageData);
  // Image resource release.
  imagePackerApi.release();
  await media.release();
}
