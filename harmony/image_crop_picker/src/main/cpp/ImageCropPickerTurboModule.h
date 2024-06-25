#pragma once

#include "RNOH/ArkTSTurboModule.h"

namespace rnoh {
  class JSI_EXPORT ImageCropPickerTurboModule : public ArkTSTurboModule 
  {
    public:
      ImageCropPickerTurboModule(const ArkTSTurboModule::Context ctx, const std::string name);
  };
}