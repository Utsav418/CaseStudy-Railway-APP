"use strict";

module.exports = {
  Users: {
    type: "object",
    properties: {
      id: {
        type: "integer",
        format: "int64",
      },
      username: { type: "string",  },
			email: { type: "string",  },
			password: { type: "string",  },
      created_at: {
        type: "string",
        format: "date-time",
      },
      updated_at: {
        type: "string",
        format: "date-time",
      },
    },
  },
};
