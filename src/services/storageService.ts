import * as ImagePicker from "expo-image-picker";
import { ID } from "react-native-appwrite";

import { appwriteConfig, storage } from "./appwrite";

export const uploadMajlisPoster = async (
  image: ImagePicker.ImagePickerAsset,
) => {
  const fileName = image.fileName || `majlis-${Date.now()}.jpg`;

  if (image.fileSize === undefined) {
    throw new Error("Image file size is unavailable");
  }

  return storage.createFile({
    bucketId: appwriteConfig.posterBucketId,
    fileId: ID.unique(),
    file: {
      name: fileName,
      type: image.mimeType || "image/jpeg",
      size: image.fileSize,
      uri: image.uri,
    },
  });
};
