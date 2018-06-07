import express from 'express';
import validate from 'express-validation';
import paramValidation from '../../config/param-validation';
import scrapeUsptoCtrl from '../controllers/scrapeUspto.controller.js';

const router = express.Router();

/**
 * @api {get} /accountTypes  All Accounts
 * @apiName Scrapes
 * @apiGroup Account
 *
 * @apiSuccess {String} startPage id of the account.
 * @apiSuccess {String} endPage name of the account.
 * @apiSuccess {String} checkIfExistsFirst  id of stripe plan linked.
 * @apiSuccess {Number} downloadOnly Cost of account.
 */
router.route('/get-uspto')
  .post(scrapeUsptoCtrl.scrapeData);

router.route('/get-usptoDetail')
  .get(scrapeUsptoCtrl.scrapeDetails);

export default router;
