// testEmail.ts
import { sendVerificationEmail } from './sendEmail';

sendVerificationEmail('govardhanreddy4628@gmail.com', '123456token')
  .then((res) => console.log(res))
  .catch((err) => console.error(err));
