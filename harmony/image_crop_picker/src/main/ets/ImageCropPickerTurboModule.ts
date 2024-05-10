import { TurboModule } from '@rnoh/react-native-openharmony/ts';
import type { TurboModuleContext } from '@rnoh/react-native-openharmony/ts';
import Logger from './Logger';
import type Want from '@ohos.app.ability.Want';
import image from '@ohos.multimedia.image';
import media from '@ohos.multimedia.media';
import util from '@ohos.util';
import picker from '@ohos.multimedia.cameraPicker';
import camera from '@ohos.multimedia.camera';
import { BusinessError } from '@ohos.base';
import fs, { Filter } from '@ohos.file.fs';


export type MediaType = 'photo' | 'video' | 'any';
export type OrderType = 'asc' | 'desc' | 'none';
export type ErrorCode = 'camera_unavailable' | 'permission' | 'others';
const MaxNumber = 5;
const MinNumber = 1;
const ImageQuality = -1;
const TAG : string = 'ImageCropPickerTurboModule';
const WANT_PARAM_URI_SELECT_SINGLE: string = 'singleselect';
const WANT_PARAM_URI_SELECT_MULTIPLE: string = 'multipleselect';
const ENTER_GALLERY_ACTION: string = "ohos.want.action.photoPicker";

let results: ResponseData = { assets: []};
let imgObj: Asset = {};
let avMetadataExtractor: media.AVMetadataExtractor;

export class RequestData {
  multiple?: boolean = false;
  writeTempFile?: boolean = true;
  includeBase64?: boolean = false;
  useFrontCamera?: boolean = false;
  forceJpg?: boolean = false;
  minFiles?: number = MinNumber;
  maxFiles?: number = MaxNumber;
  mediaType?: MediaType = 'any';
  compressImageQuality?: number;
  path?: string;
  width?: number;
  height?: number;

}
export class FilePath{
  path?: string;
}
export class Asset {
  localIdentifier?: string;
  exif?: Exif;
  cropRect?: CropRect;

  duration?: string;
  creationDate?: number;
  modificationDate?: number;
  sourceURL?: string;
  filename?: string;
  mime?: string;
  path?: string;
  size?: number;
  height?: string;
  width?: string;
  data?: string;
}

class Exif {

}

class CropRect {

}

interface ResponseData {
  didCancel?: boolean;
  errorCode?: ErrorCode;
  errorMessage?: string;
  assets?: Asset[];
}

interface FilePathResult {
  result?: FilePath[];
}


export class AbilityResult {
  resultCode: number;
  want?: Want;
}


export class ImageCropPickerTurboModule extends TurboModule {

  constructor(protected ctx: TurboModuleContext) {
    super(ctx);
  }

  isNullOrUndefined(value: any): boolean {
    return value === null || value === undefined;
  }

  async openPicker(request?: RequestData): Promise<ResponseData> {
    Logger.info(TAG, 'into openPicker request' + JSON.stringify(request));
    results = { assets: []};
    if (request.multiple && request.minFiles >= request.maxFiles) {
      results.errorMessage = 'minFiles number should be less than maxFiles number';
      return results;
    }
    let quality = request.compressImageQuality;
    if (!this.isNullOrUndefined(quality) && !(quality >= 0 && quality <= 1)) {
      results.errorMessage = 'compressImageQuality parameter error';
      return results;
    }
    let multiple = this.isNullOrUndefined(request.multiple) ? false : request.multiple;
    let mediaType = request.mediaType == 'photo' ? 'FILTER_MEDIA_TYPE_IMAGE'
      : (request.mediaType == 'video' ? 'FILTER_MEDIA_TYPE_VIDEO' : 'FILTER_MEDIA_TYPE_ALL');
    let maxFiles = this.isNullOrUndefined(request.maxFiles) ? MaxNumber : request.maxFiles;
    let writeTempFile = this.isNullOrUndefined(request.writeTempFile) ? true :request.writeTempFile;
    let qualityNumber = this.isNullOrUndefined(request.compressImageQuality) ? ImageQuality : request.compressImageQuality;
    let forceJpg = this.isNullOrUndefined(request.forceJpg) ? false : request.forceJpg;

    let want : Want = {};
    if (multiple) {
      want = {
        "type": WANT_PARAM_URI_SELECT_MULTIPLE,
        "action": ENTER_GALLERY_ACTION,
        "parameters": {
          uri: WANT_PARAM_URI_SELECT_MULTIPLE,
          filterMediaType: mediaType,
          maxSelectCount: maxFiles,
          isShowSerialNum: true,
        },
        "entities": []
      }
    } else {
      want = {
        "type": WANT_PARAM_URI_SELECT_SINGLE,
        "action": ENTER_GALLERY_ACTION,
        "parameters": {
          uri: WANT_PARAM_URI_SELECT_SINGLE,
          filterMediaType: mediaType,
        },
        "entities": []
      }
    }
    let result: AbilityResult = await this.ctx.uiAbilityContext.startAbilityForResult(want as Want);
    if (result.resultCode == -1) {
      results.didCancel = true;
      return results;
    }
    let sourceFilePaths: Array<string> = result.want.parameters['select-item-list'] as Array<string>;
    let tempFilePaths = null;
    Logger.info(TAG, 'into openPicker tempFilePaths = '+ qualityNumber + '' + forceJpg);
    if (!(qualityNumber == -1 && !forceJpg)) {
      tempFilePaths = await this.compressPictures(qualityNumber * 100, forceJpg, sourceFilePaths);
    } else {
      tempFilePaths = writeTempFile ? this.getTempFilePaths(sourceFilePaths) : null;
    }
    Logger.info(TAG, 'into openPicker tempFilePaths = '+ tempFilePaths.toString());
    return this.getPickerResult(request, sourceFilePaths, tempFilePaths);
  }

  getTempFilePaths(images : Array<string>): Array<string> {
    let resultImages : Array<string> = new Array<string>();
    Logger.info(TAG, 'getTempFilePaths images = '+ images);
    for (let srcPath of images) {
      if (this.isImage(srcPath)) {
        Logger.info(TAG, 'getTempFilePaths img srcPath = '+ srcPath);
        let i = srcPath.lastIndexOf('.');
        let imageType = '';
        if (i != -1) {
          imageType = srcPath.substring(i + 1);
          Logger.info(TAG, 'getTempFilePaths img imageType = '+ imageType);
        }
        let file = fs.openSync(srcPath, fs.OpenMode.CREATE);
        let dstPath = this.ctx.uiAbilityContext.tempDir + '/rn_image_crop_picker_lib_temp_' + util.generateRandomUUID(true) + '.' + imageType;
        try {
          fs.copyFileSync(file.fd, dstPath, 0);
          resultImages.push(dstPath);
          Logger.info(TAG, 'getTempFilePaths suc dstPath = '+ dstPath);
        } catch (err) {
          Logger.info(TAG, 'getTempFilePaths fail err = '+ err.toString());
        }
        fs.closeSync(file);
      } else {
        Logger.info(TAG, 'getTempFilePaths video srcPath = '+ srcPath);
        resultImages.push(srcPath);
      }
    }
    return resultImages;
  }

  async getPickerResult(request: RequestData, sourceFilePaths : Array<string>, tempFilePaths : Array<string>): Promise<ResponseData> {
    Logger.info(TAG, 'into openPickerResult :');
    let images = this.isNullOrUndefined(tempFilePaths) ? sourceFilePaths : tempFilePaths;
    Logger.info(TAG, 'into openPickerResult : images = '+ images);
    let includeBase64 = this.isNullOrUndefined(request.includeBase64) ? false : request.includeBase64;
    for (let j = 0;j < images.length;j++) {
      imgObj = {};
      let value = images[j];
      const mimeUri = value.substring(0, 4)
      let imageType;
      let fileName;
      if (mimeUri === 'file') {
        let i = value.lastIndexOf('/')
        fileName = value.substring(i + 1)
        i = value.lastIndexOf('.')
        if (i != -1) {
          imageType = value.substring(i + 1)
        }
      }
      imgObj.sourceURL = sourceFilePaths[j];
      imgObj.path = value;
      imgObj.filename = fileName;

      let file = fs.openSync(value, fs.OpenMode.READ_ONLY)
      Logger.info(TAG, 'into openSync : file.fd = '+ file.fd + ' file.path = ' + file.path + ' file.name = ' + file.name);
      let stat = fs.statSync(file.fd);
      let length = stat.size;
      imgObj.size = length;
      imgObj.creationDate = stat.ctime;
      imgObj.modificationDate = stat.mtime;
      if (this.isImage(value)) {
        imgObj.data = includeBase64 ? this.imageToBase64(value) : '';
        imgObj.mime = 'image/' + imageType;
        Logger.info(TAG, 'into openPickerResult value :' + value);
        let imageIS = image.createImageSource(file.fd)
        let imagePM = await imageIS.createPixelMap()
        Logger.info(TAG, 'end createImageSource : imageIS = ' + imageIS + ' imagePM = '+ imagePM);
        let imgInfo = await imagePM.getImageInfo();
        imgObj.height = imgInfo.size.height + '';
        imgObj.width = imgInfo.size.width + '';
        imagePM.release().then(() => {
          imagePM = undefined;
        })
        imageIS.release().then(() => {
          imageIS = undefined;
        })
        imgObj.duration = '';
      } else {
        Logger.info(TAG, 'into getPickerResult video start');
        imgObj.data = '';
        imgObj.mime = 'video/' + imageType;
        let url = 'fd://' + file.fd;
        Logger.info(TAG, 'start avPlayer url:' + url);
        avMetadataExtractor = await media.createAVMetadataExtractor();
        avMetadataExtractor.fdSrc = { fd: file.fd, offset: 0, length: length };
        try {
          const res = await avMetadataExtractor.fetchMetadata();
          imgObj.duration = res.duration;
          imgObj.width = res.videoWidth;
          imgObj.height = res.videoHeight;
        } catch (error) {
          Logger.error(TAG, 'get video info suc error:' + error);
        }
      }
      fs.closeSync(file);
      results.assets.push(imgObj);
    }
    return results;
  }

  async openCamera(request?: RequestData): Promise<ResponseData> {
    Logger.info(TAG, 'into openCamera request: ' + JSON.stringify(request));
    let results: ResponseData = { assets: []};
    let useFrontCamera = this.isNullOrUndefined(request.useFrontCamera) ? false : request.useFrontCamera;
    let mediaType = request.mediaType == 'photo' ? [picker.PickerMediaType.PHOTO] : (request.mediaType == 'video'
      ? [picker.PickerMediaType.VIDEO] : [picker.PickerMediaType.PHOTO,picker.PickerMediaType.VIDEO]);
    try {
      let mContext = await this.ctx.uiAbilityContext;
      let pickerProfile: picker.PickerProfile = {
        cameraPosition: useFrontCamera? camera.CameraPosition.CAMERA_POSITION_FRONT : camera.CameraPosition.CAMERA_POSITION_BACK,
      };
      let pickerResult: picker.PickerResult = await picker.pick(mContext, mediaType, pickerProfile);
      Logger.info(TAG, 'into openCamera results: ' + JSON.stringify(pickerResult));
      imgObj.sourceURL = pickerResult.resultUri;
      results.assets.push(imgObj);
    } catch (error) {
      let err = error as BusinessError;
      Logger.info(TAG, 'into openCamera error: ' + JSON.stringify(err));
    }
    return results;
  };

  imageToBase64(filePath: string): string {
    Logger.info(TAG, 'into imageToBase64 filePath: ' + filePath);
    let base64Data;
    try {
      let file = fs.openSync(filePath, fs.OpenMode.READ_ONLY);
      let buf = new ArrayBuffer(4096);
      fs.readSync(file.fd, buf);
      let unit8Array: Uint8Array = new Uint8Array(buf);
      let base64Helper = new util.Base64Helper();
      base64Data = base64Helper.encodeToStringSync(unit8Array, util.Type.BASIC);
      fs.closeSync(file);
      Logger.info(TAG, 'into imageToBase64 base64Data: ' + base64Data);
    } catch (err) {
      Logger.error(TAG, 'into imageToBase64 err: ' + JSON.stringify(err));
    }
    return base64Data;
  }

  isImage(filePath : string) : boolean{
    Logger.info(TAG, 'into isImage fileName = ' + filePath);
    const imageExtensionsRegex = /\.(jpg|jpeg|png|gif|bmp|webp)$/i;
    return imageExtensionsRegex.test(filePath);
  }

  async compressPictures(quality: number, forceJpg : boolean, sourceURL: Array<string>) : Promise<Array<string>> {
    Logger.info(TAG, 'into compressPictures sourceURL: ' + sourceURL + ' quality: ' + quality + ' forceJpg: ' + forceJpg);
    let imageType : string = 'jpeg';
    let resultImages : Array<string> = new Array<string>();
    for (let srcPath of sourceURL) {
      if (this.isImage(srcPath)) {
        Logger.info(TAG, 'into compressPictures img srcPath :' + srcPath);
        let i = srcPath.lastIndexOf('.');
        if (!forceJpg && i != -1) {
          imageType = srcPath.substring(i + 1);
        }
        Logger.info(TAG, 'into compressPictures imageType: ' + imageType);
        let files = fs.openSync(srcPath, fs.OpenMode.READ_ONLY)
        let imageISs = image.createImageSource(files.fd);
        let imagePMs = await imageISs.createPixelMap() ;
        let imagePackerApi = image.createImagePacker();
        let options: image.PackingOption = {
          format: 'image/' +imageType,
          quality: quality,
        };
        try{
          let packerData = await imagePackerApi.packing(imagePMs, options);
          Logger.info(TAG, 'into compressPictures data: ' + JSON.stringify(packerData));
          let dstPath = this.ctx.uiAbilityContext.tempDir + '/rn_image_crop_picker_lib_temp_' + util.generateRandomUUID(true) + '.' + imageType;
          let newFile = fs.openSync(dstPath, fs.OpenMode.CREATE | fs.OpenMode.READ_WRITE);
          Logger.info(TAG, 'into compressPictures newFile id: ' + newFile.fd);
          const number = fs.writeSync(newFile.fd, packerData);
          Logger.info(TAG, 'into compressPictures write data to file succeed size: ' + number);
          resultImages.push(dstPath);
          fs.closeSync(files);
        } catch (err) {
          Logger.error(TAG, 'into compressPictures write data to file failed err: ' + JSON.stringify(err));
        }
      } else {
        Logger.info(TAG, 'into compressPictures video srcPath :' + srcPath);
        resultImages.push(srcPath);
      }
    }
    return resultImages;
  }

  async getListFile(): Promise<FilePathResult> {
    let filePathResult : FilePathResult = { result: []};
    let filesDir = this.ctx.uiAbilityContext.tempDir;
    class ListFileOption {
      public recursion: boolean = false;
      public listNum: number = 0;
      public filter: Filter = {};
    }
    let option = new ListFileOption();
    option.filter.suffix = ['.jpg'];
    option.filter.displayName = ['*'];
    option.filter.fileSizeOver = 0;
    option.filter.lastModifiedAfter = new Date(0).getTime();
    Logger.info(TAG, "into getListFile filesDir = " + filesDir);
    let files = fs.listFileSync(filesDir, option);
    for (let i = 0; i < files.length; i++) {
      let listFilePath: FilePath = {}
      listFilePath.path = files[i];
      filePathResult.result.push(listFilePath);
    }
    Logger.info(TAG, "into getListFile arrayList = " + JSON.stringify(filePathResult));
    return filePathResult;
  }

  async cleanSingle(path: string): Promise<void> {
    Logger.info(TAG, "into cleanSingle path = "+path);
    let filePath = this.ctx.uiAbilityContext.tempDir + "/" + path;
    fs.access(filePath, (err) => {
      if (err) {
        Logger.info(TAG, 'cleanSingle access error data =' + err.data);
      } else {
        fs.unlink(filePath).then(() => {
          Logger.info(TAG, "cleanSingle file succeed");
        }).catch((err: BusinessError) => {
          Logger.error(TAG, "cleanSingle err : " + JSON.stringify(err));
        });
      }
    });
  }

  async clean(): Promise<void> {
    let dirPath = this.ctx.uiAbilityContext.tempDir;
    fs.rmdir(dirPath).then(() => {
      Logger.info(TAG, "clean rmdir succeed");
    }).catch((err: BusinessError) => {
      Logger.error(TAG, "clean rmdir err : " + JSON.stringify(err));
    });
  }

  async openCropper(request?: RequestData): Promise<ResponseData>{
    return new Promise((res, rej) => {
      let results: ResponseData = { assets: []};
      Logger.info(TAG, 'into openCropper request: ' + JSON.stringify(request));
      let bundleName = this.ctx.uiAbilityContext.abilityInfo.bundleName;
      let uri = request.path;
      try {
        let want: Want = {
          "bundleName": bundleName,
          "abilityName": "ImageEditAbility",
          parameters: {
            'imageUri': uri,
          }
        }
        this.ctx.uiAbilityContext.startAbilityForResult(want, (error, data) => {
          let imgPath = AppStorage.get('cropImagePath') as string;
          imgObj.sourceURL = imgPath;
          results.assets.push(imgObj);
          AppStorage.setOrCreate('cropImagePath', '')
          Logger.info(TAG, 'into openCropper startAbility suc : ' + imgPath);
          res(results);
        } );
      } catch (err) {
        Logger.info(TAG, 'into openCropper startAbility err: ' + JSON.stringify(err));
        rej(results)
      }
    })
  }
}