import CryptoJS from "crypto-js";

const SECRET_KEY = "your-secret-key"; // TODO: In a real app, this should be securely stored and not hardcoded

export const encryptData = (data: string): string => {
  return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
};

export const decryptData = (encryptedData: string): string => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};
