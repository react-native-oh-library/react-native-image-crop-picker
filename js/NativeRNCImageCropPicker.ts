import type { TurboModule } from "react-native/library/TurboModule/RCTExport";
import { TurboModuleRegistry } from "react-native";

export interface OptionsCommon {
    cropping?: boolean;
    width?: number;
    height?: number;
    multiple?: boolean;
    writeTempFile?: boolean;
    includeBase64?: boolean;
    includeExif?: boolean;
    avoidEmptySpaceAroundImage?: boolean;
    freeStyleCropEnabled?: boolean;
    cropperToolbarTitle?: string;
    cropperCircleOverlay?: boolean;
    minFiles?: number;
    maxFiles?: number;
    useFrontCamera?: boolean;
    compressVideoPreset?: string;
    compressImageMaxWidth?: number;
    compressImageMaxHeight?: number;
    compressImageQuality?: number;
    loadingLabelText?: string;
    showsSelectedCount?: boolean;
    forceJpg?: boolean;
    showCropGuidelines?: boolean;
    showCropFrame?: boolean;
    hideBottomControls?: boolean;
    enableRotationGesture?: boolean;
    cropperChooseText?: boolean;
    cropperChooseColor?: boolean;
    cropperCancelText?: boolean;
    cropperCancelColor?: boolean;
    cropperRotateButtonsHidden?: boolean;
}

export type ErrorCode = 'camera_unavailable' | 'permission' | 'others';

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

export interface Spec extends TurboModule {
    openPicker(options: OptionsCommon): Promise<ResponseData>;
    openCamera(options: OptionsCommon): Promise<ResponseData>;
    openCropper(options: OptionsCommon): Promise<ResponseData>;
    clean(): Promise<void>;
    cleanSingle(path: string): Promise<void>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('ImageCropPicker')