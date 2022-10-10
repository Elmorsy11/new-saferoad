import { configureStore } from "@reduxjs/toolkit";

import ConfigSlice from "./slices/config";
import LayoutConfigSlice from "./slices/layoutConfig";
import mainMapSlice from "./slices/mainMap";
import StreamDataSlice from "./slices/StreamData";
import ToggleMinuTrackSlice from "./slices/toggleMinuTrack";


export default configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
  reducer: {
    config: ConfigSlice,
    layoutConfig: LayoutConfigSlice,
    mainMap: mainMapSlice,
    streamData: StreamDataSlice,
    toggleMinuTrack: ToggleMinuTrackSlice,
  },
});
