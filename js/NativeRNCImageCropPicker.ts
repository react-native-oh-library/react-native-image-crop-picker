import type { TurboModule } from "react-native/library/TurboModule/RCTExport";
import { TurboModuleRegistry } from "react-native";

export class OptionsCommon {
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

interface ResponseData {
    path : string;
}

export interface Spec extends TurboModule {
    openPicker(options: OptionsCommon): Promise<ResponseData>;
    openCamera(options: OptionsCommon): Promise<ResponseData>;
    openCropper(options: OptionsCommon): Promise<ResponseData>;
    clean(): Promise<void>;
    cleanSingle(path: string): Promise<void>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('ImageCropPicker')