
# Progressly
#### A project management tool for teams, a project by [Fahim Alif](https://github.com/Fahimkhan9)



## Link
 https://progressly-gamma.vercel.app/









## Features

- Users can create teams and invite existing app members to the team.Invited users can join the team through link sent by emails.
- Users can a project to track with a specific team and assign task to team members.
- Task assignee will get notification in website and in their computers.
- Task have 3 status `TODO,IN_PROGRESS,DONE`.These can be updated by drag and drop.
- Role based authorization in teams.
- Notification dropdown in teams.





## Built with 

- Nextjs 15
- Auth: Clerk
- Database: Firestore
- UI: Daisyui
- Emails: Mailersend
- Notifications: Onesignal


## To-do
- Add Calendar feature



### Environment variables


```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_MEASUREMENT_ID=
MAILER_SEND_API_KEY=
DOMAIN=
NEXT_PUBLIC_ONESIGNAL_APP_ID=
MAILERSEND_EMAIL=
ONESIGNAL_APP_ID=
ONESIGNAL_API_KEY=
```







