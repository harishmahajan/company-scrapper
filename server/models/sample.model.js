import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';

const SampleSchema = new mongoose.Schema({

  Name: {
    type: String,
    optional: false
  },

  Description: {
    type: String,
    optional: true,
    defaultValue: null
  },

  CreatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Sample', SampleSchema);
