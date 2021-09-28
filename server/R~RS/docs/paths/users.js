"use strict";

module.exports = {
  "/users": {
    get: {
      tags: ["Users"], // operation's tag.
      description: "Get all Users", // operation's desc.
      operationId: "getUsers", // unique operation id.
      parameters: [
        {
          in: "query",
          name: "limit",
          description: "The Limit number of items in a single query",
          schema: {
            type: "integer",
            example: 10,
          },
        },
        {
          in: "query",
          name: "page",
          description: "The Page number from database",
          schema: {
            type: "integer",
            example: 1,
          },
        },
      ], // expected params.
      // expected responses
      responses: {
        // response code
        200: {
          description: "Users fetched", // response desc.
          content: {
            // content-type
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  msg: {
                    type: "string",
                    example: "users fetched",
                  },
                  data: {
                    type: "array",
                    items: {
                      $ref: "#/definitions/Users",
                    },
                  },
                  page: {
                    type: "number",
                    example: "1"
                  },
                  limit: {
                    type: "number",
                    example: "10"
                  },
                  total_page: {
                    type: "number",
                    example: "1"
                  }
                },
              },
            },
          },
        },
      },
    },
    post: {
      tags: ["Users"], // operation's tag.
      description: "Create Users", // operation's desc.
      operationId: "createUsers", // unique operation id.
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                username: { type: "string",  },
			email: { type: "string",  },
			password: { type: "string",  },
              },
            },
          },
        },
      },
      // expected responses
      responses: {
        // response code
        200: {
          description: "Users created", // response desc.
          content: {
            // content-type
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  msg: {
                    type: "string",
                    example: "users created",
                  },
                  data: {
                    type: "array",
                    items: {
                      $ref: "#/definitions/Users",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  "/users/{id}": {
    get: {
      tags: ["Users"], // operation's tag.
      description: "Get Users by id", // operation's desc.
      operationId: "getUsersById", // unique operation id.
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          description: "The id of the Users",
          type: "integer",
          example: 1,
        },
      ], // expected params.
      // expected responses
      responses: {
        // response code
        200: {
          description: "Users fetched", // response desc.
          content: {
            // content-type
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  msg: {
                    type: "string",
                    example: "users fetched",
                  },
                  data: {
                    type: "array",
                    items: {
                      $ref: "#/definitions/Users",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    put: {
      tags: ["Users"], // operation's tag.
      description: "Update Users by id", // operation's desc.
      operationId: "updateUsersById", // unique operation id.
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          description: "The id of the Users",
          type: "integer",
          example: 1,
        },
      ], // expected params.
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                username: { type: "string",  },
			email: { type: "string",  },
			password: { type: "string",  },
              },
            },
          },
        },
      },
      // expected responses
      responses: {
        // response code
        200: {
          description: "Users updated", // response desc.
          content: {
            // content-type
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  msg: {
                    type: "string",
                    example: "users updated",
                  },
                  data: {
                    type: "array",
                    items: {
                      $ref: "#/definitions/Users",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    delete: {
      tags: ["Users"], // operation's tag.
      description: "Delete Users by id", // operation's desc.
      operationId: "deleteUsersById", // unique operation id.
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          description: "The id of the Users",
          type: "integer",
          example: 1,
        },
      ], // expected params.
      // expected responses
      responses: {
        // response code
        200: {
          description: "Users deleted", // response desc.
          content: {
            // content-type
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  msg: {
                    type: "string",
                    example: "users deleted",
                  },
                  data: {
                    type: "integer",
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};
