import { customAlphabet } from "nanoid";

export const createotp = ({alphabet = "0123456789",size = 6}={})=>{
    return customAlphabet(alphabet,size)()
}