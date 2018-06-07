import Joi from 'joi';

export default {
  // POST /api/users
  createUser: {
    body: {
      email: Joi.string().required(),
      phoneNumber: Joi.string().required(),
    }
  },

  createAccountType: {
    body: {
      accountName: Joi.string().required(),
      accountCost: Joi.number().required()
    }
  },

  createNotificationList: {
    body: {
      type: Joi.string().required(),
      title: Joi.array().required(),
      body: Joi.array().required()
    }
  },

  permitRequest: {
    body: {
      requestorId: Joi.string().required(),
      requesteeId: Joi.string().required(),
      command: Joi.string().required()
    }
  },

  // UPDATE /api/users/:userId
  //TODO require auth
  updateUser: {
    body: {

    },
    params: {
      userId: Joi.string().hex().required()
    }
  },

  updateAccountType: {
    body: {
      accountName: Joi.string().required(),
      accountCost: Joi.number().required()
    },
    params: {
      accountId: Joi.string().hex().required()
    }
  },

  updateNotificationList: {
    body: {
      type: Joi.string().required(),
      title: Joi.array().required(),
      body: Joi.array().required()
    },
    params: {
      notificationListId: Joi.string().hex().required()
    }
  },

  createNotification: {
    body: {
      image: Joi.string().required(),
      icon: Joi.string().required(),
      message: Joi.string().required()
    }
  },

  // POST /api/auth/login
  login: {
    body: {
      email: Joi.string().email().required()
    }
  }
};
