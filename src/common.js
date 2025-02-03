export const libraries = ["places"];

export const formatImages = (file) => {
  return new Promise((resolve, reject) => {
    if (file?.type.includes("image")) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const base64 = e.target.result;
        resolve(base64);
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsDataURL(file);
    } else {
      reject(new Error("The selected file is not an image."));
    }
  });
};
