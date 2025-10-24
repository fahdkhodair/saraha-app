import {EventEmitter} from 'node:events'
import { sendEmail } from '../email/send.email.js'
export const emailevent = new EventEmitter()

emailevent.on("confirm-email",async(data)=>{
    await sendEmail({to:data.to,subject:data.subject || "confirm-email",html:`<h1>otp:${data.otp}</h1>`
    }).catch(error=>{
    console.log(`fail to send email ${data.to}`);
    })

})
