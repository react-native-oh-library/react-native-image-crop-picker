#include "RNImageCropPickerTurboModule.h"
#include "RNOH/ArkTSTurboModule.h"

using namespace rnoh;
using namespace facebook;

static jsi::Value __hostFunction_RNImageCropPickerTurboModule_openPicker(jsi::Runtime &rt,
                                                                       react::TurboModule &turboModule,
                                                                       const jsi::Value *args, size_t count)
{
    return static_cast<ArkTSTurboModule &>(turboModule).callAsync(rt, "openPicker", args, count);
}

static jsi::Value __hostFunction_RNImageCropPickerTurboModule_openCamera(jsi::Runtime &rt,
                                                                       react::TurboModule &turboModule,
                                                                       const jsi::Value *args, size_t count)
{
    return static_cast<ArkTSTurboModule &>(turboModule).callAsync(rt, "openCamera", args, count);
}

static jsi::Value __hostFunction_RNImageCropPickerTurboModule_openCropper(jsi::Runtime &rt,
                                                                       react::TurboModule &turboModule,
                                                                       const jsi::Value *args, size_t count) {
    return static_cast<ArkTSTurboModule &>(turboModule).callAsync(rt, "openCropper", args, count);
}

static jsi::Value __hostFunction_RNImageCropPickerTurboModule_cleanSingle(jsi::Runtime &rt,
                                                                       react::TurboModule &turboModule,
                                                                       const jsi::Value *args, size_t count) {
    return static_cast<ArkTSTurboModule &>(turboModule).callAsync(rt, "cleanSingle", args, count);
}

static jsi::Value __hostFunction_RNImageCropPickerTurboModule_clean(jsi::Runtime &rt,
                                                                       react::TurboModule &turboModule,
                                                                       const jsi::Value *args, size_t count) {
    return static_cast<ArkTSTurboModule &>(turboModule).call(rt, "clean", args, count);
}

RNImageCropPickerTurboModule::RNImageCropPickerTurboModule(const ArkTSTurboModule::Context ctx, const std::string name)
    : ArkTSTurboModule(ctx, name)
{
    methodMap_["openPicker"] = MethodMetadata{1, __hostFunction_RNImageCropPickerTurboModule_openPicker};
    methodMap_["openCamera"] = MethodMetadata{1, __hostFunction_RNImageCropPickerTurboModule_openCamera};
    methodMap_["openCropper"] = MethodMetadata{1, __hostFunction_RNImageCropPickerTurboModule_openCropper};
    methodMap_["cleanSingle"] = MethodMetadata{1, __hostFunction_RNImageCropPickerTurboModule_cleanSingle};
    methodMap_["clean"] = MethodMetadata{0, __hostFunction_RNImageCropPickerTurboModule_clean};
}