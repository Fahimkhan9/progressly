import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import jwt from 'jsonwebtoken'
import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";
import OneSignal from 'react-onesignal';
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
interface JwtPayload {
  userid: string;
  email: string;
  // Add any other custom claims you need
}
const JWT_SECRET = process.env.JWT_SECRET || 'your_fallback_secret'; 
export function generateJwtToken(payload: JwtPayload, expiresIn: string = '1d'): string {
  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn, // e.g., '1h', '7d'
    issuer: 'fahimalif',
  });

  return token;
}
export const sendEmailToInvitedTeamMember=async (sentemail:string,teamadminname:string,teamname:string,token:string)=>{
  if(process.env.MAILER_SEND_API_KEY && process.env.DOMAIN){
    const mailerSend = new MailerSend({
      apiKey: process.env.MAILER_SEND_API_KEY,
    });
    console.log(process.env.MAILER_SEND_API_KEY);
    console.log(process.env.DOMAIN);
    
    
    const sentFrom = new Sender("MS_oZ1rnk@test-3m5jgroo130gdpyo.mlsender.net", teamadminname);
    const recipients = [
      new Recipient(sentemail, sentemail)
    ];
    const html= `<h1>Invitation to join ${teamname}</h1>
    <p>Dear ${sentemail},</p>
    <p>You have been invited to join the team ${teamname}.</p>
    <p>To accept the invitation, please click the link below:</p>
    <p><a href="${process.env.DOMAIN}/profile/team/accept/${token}">Accept Invitation</a></p>`
    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setReplyTo(sentFrom)
      .setSubject(`Invitation to join ${teamname}`)
      .setHtml(html)
      .setText(`Dear ${sentemail}, You have been invited to join the team ${teamname}. To accept the invitation, please click the link below: ${process.env.DOMAIN}/profile/team/accept/${token}`)
    
    await mailerSend.email.send(emailParams);
  }else{
    console.log('not found domain and mailsend api key');
    
  }
 
}

export const onesignalinit=OneSignal.init({appId:process.env.ONESIGNAL_APP_ID})