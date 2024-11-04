import { application, Router } from 'express';
import { login, register } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth';
import {
  createContact,
  deleteContact,
  getContacts,
  getSpamNumbers,
  markSpam,
  searchByName,
  searchByPhone,
} from '../controllers/contact.controller';

const router = Router();

router.post('/register', register);
router.post('/login', login);

router.use(authenticate);
router.post('/create-contact', createContact);
router.get('/contacts', getContacts);
router.delete('/delete-contact/:contactId', deleteContact);
router.get('/search/name', searchByName);
router.get('/search/phone', searchByPhone);
router.post('/mark-spam', markSpam);
router.get('/spam', getSpamNumbers);

export default router;
