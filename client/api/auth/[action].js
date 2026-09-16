import registerHandler from './register.js';
import verifyHandler from './verify.js';
import loginHandler from './login.js';
import meHandler from './me.js';
import logoutHandler from './logout.js';
import consumeReviewHandler from './consume-review.js';
import { setCorsHeaders } from './_store.js';

export default async function handler(req, res) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const action = req.query.action || '';

  switch (action) {
    case 'register':
      return registerHandler(req, res);
    case 'verify':
      return verifyHandler(req, res);
    case 'login':
      return loginHandler(req, res);
    case 'me':
      return meHandler(req, res);
    case 'logout':
      return logoutHandler(req, res);
    case 'consume-review':
      return consumeReviewHandler(req, res);
    default:
      return res.status(404).json({ success: false, error: `Unknown auth action: ${action}` });
  }
}
