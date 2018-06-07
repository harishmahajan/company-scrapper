import express from 'express';
import scrapeNevada from './scrapeNevada.route';
import scrapeCalifornia from './scrapeCalifornia.route';
import scrapeWyoming from './scrapeWyoming.route';
import scrapeDakota from './scrapeDakota.route';
import scrapeFlorida from './scrapeFlorida.route';
import scrapeNewYork from './scrapeNewYork.route';
import scrapeDelaware from './scrapeDelaware.route';
import scrapeAlaska from './scrapeAlaska.route';
import scrapeMontana from './scrapeMontana.route';
import scrapeUtah from './scrapeUtah.route';
import scrapeCdtfa from './scrapeCdtfa.route';
import scrapeBsDos from './scrapeBsDos.route';
import scrapeSilverflume from './scrapeSilverflume.route';
import scrapeUspto from './scrapeUspto.route';


//scrapeUspto.controller.js
const router = express.Router(); // eslint-disable-line new-cap

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK')
);

// mount user routes at /scrape
router.use('/scrape-nevada', scrapeNevada);

router.use('/scrape-california', scrapeCalifornia);

router.use('/scrape-wyoming', scrapeWyoming);

router.use('/scrape-southdakota', scrapeDakota);

router.use('/scrape-florida', scrapeFlorida);

router.use('/scrape-newyork', scrapeNewYork);

router.use('/scrape-delaware', scrapeDelaware);

router.use('/scrape-alaska', scrapeAlaska);

router.use('/scrape-montana', scrapeMontana);

router.use('/scrape-utah', scrapeUtah);

router.use('/scrape-cdtfa', scrapeCdtfa);

router.use('/scrape-bsdsos', scrapeBsDos);

router.use('/scrape-silverflume', scrapeSilverflume);

router.use('/scrape-uspto', scrapeUspto);


export default router;
