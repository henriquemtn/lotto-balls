import storage from "@react-native-firebase/storage";

export const uploadImage = async (uri: string): Promise<string> => {
  try {
    const filename = uri.substring(uri.lastIndexOf("/") + 1);
    const storageRef = storage().ref(`images/${filename}`);
    
    await storageRef.putFile(uri);
    const imageUrl = await storageRef.getDownloadURL();
    
    return imageUrl;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};