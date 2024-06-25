#include "ImageCropPickerTurboModule.h"
#include "RNOH/ArkTSTurboModule.h"

using namespace rnoh;
using namespace facebook;

static jsi::Value _hostFunction_RNCImageCropPickerTurboModule_openPicker(
  jsi::Runtime &rt,
  react::TurboModule &turboModule,
  const jsi::Value *args,
  size_t count)
{
  return static_cast<ArkTSTurboModule &>(turboModule).callAsync(rt, "openPicker", args, count);
}

static jsi::Value _hostFunction_RNCImageCropPickerTurboModule_openCamera(
  jsi::Runtime &rt,
  react::TurboModule &turboModule,
  const jsi::Value *args,
  size_t count)
{
  return static_cast<ArkTSTurboModule &>(turboModule).callAsync(rt, "openCamera", args, count);
}

static jsi::Value _hostFunction_RNCImageCropPickerTurboModule_openCropper(
  jsi::Runtime &rt,
  react::TurboModule &turboModule,
  const jsi::Value *args,
  size_t count)
{
  return static_cast<ArkTSTurboModule &>(turboModule).callAsync(rt, "openCropper", args, count);
}

static jsi::Value _hostFunction_RNCImageCropPickerTurboModule_cleanSingle(
  jsi::Runtime &rt,
  react::TurboModule &turboModule,
  const jsi::Value *args,
  size_t count)
{
  return static_cast<ArkTSTurboModule &>(turboModule).callAsync(rt, "cleanSingle", args, count);
}

static jsi::Value _hostFunction_RNCImageCropPickerTurboModule_clean(
  jsi::Runtime &rt,
  react::TurboModule &turboModule,
  const jsi::Value *args,
  size_t count)
{
  return static_cast<ArkTSTurboModule &>(turboModule).callAsync(rt, "clean", args, count);
}

ImageCropPickerTurboModule::ImageCropPickerTurboModule(
  const ArkTSTurboModule::Context ctx,
  const std::string name): ArkTSTurboModule(ctx, name)
{
  methodMap_["openPicker"] = MethodMetadata{1, _hostFunction_RNCImageCropPickerTurboModule_openPicker};
  methodMap_["openCamera"] = MethodMetadata{1, _hostFunction_RNCImageCropPickerTurboModule_openCamera};
  methodMap_["openCropper"] = MethodMetadata{1, _hostFunction_RNCImageCropPickerTurboModule_openCropper};
  methodMap_["cleanSingle"] = MethodMetadata{1, _hostFunction_RNCImageCropPickerTurboModule_cleanSingle};
  methodMap_["clean"] = MethodMetadata{0, _hostFunction_RNCImageCropPickerTurboModule_clean};
}