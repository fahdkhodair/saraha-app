import CryptoJS from "crypto-js";
export const createencryption = async({plaintext ="",secretkey=process.env.secretkey})=>{
return CryptoJS.AES.encrypt(plaintext,secretkey)
}

export const decryptencryption = async({ciphertext ="",secretkey=process.env.secretkey}={})=>{
return CryptoJS.AES.decrypt(ciphertext,secretkey).toString()
}