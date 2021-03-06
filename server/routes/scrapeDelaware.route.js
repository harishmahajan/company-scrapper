import express from 'express';
import validate from 'express-validation';
import paramValidation from '../../config/param-validation';
import scrapeDelawareCtrl from '../controllers/scrapeStateofDelaware.controller.js';

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
router.route('/get-delawaredata')
  .get(scrapeDelawareCtrl.scrapeData);

router.route('/get-delawaredetail')
  .get(scrapeDelawareCtrl.scrapeDetails);

export default router;
