import {https} from 'firebase-functions';
import {app} from './users';

export const api = https.onRequest(app);
