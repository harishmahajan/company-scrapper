import express from 'express';
import validate from 'express-validation';
import paramValidation from '../../config/param-validation';
import scrapeNewYorkCtrl from '../controllers/scrapeNewYork.controller';

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
router.route('/get-data')
  .get(scrapeNewYorkCtrl.scrapeData);

router.route('/get-detail')
  .get(scrapeNewYorkCtrl.scrapeDetails);

export default router;
