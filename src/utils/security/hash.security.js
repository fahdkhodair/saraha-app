import bcrypt from "bcryptjs";

export const createHash = async({plaintext ="",saltRound= process.env.salt})=>{
return bcrypt.hashSync(plaintext,parseInt(saltRound))
}

export const compareHash = async({plaintext ="",hashValue = ""}={})=>{
return bcrypt.compareSync(plaintext,hashValue)
}