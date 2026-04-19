//src/types/todo.types.js

/**
 * @typedef {Object} Todo
 * @property {number} [id]
 * @property {string} title
 * @property {boolean} doneStatus
 * @property {string} [description]
 */

/**
 * @typedef {Object} TodoResponse
 * @property {Todo[]} todos
 */

/**
 * @typedef {Object} Challenge
 * @property {number} id
 * @property {string} name
 * @property {string} description
 * @property {boolean} status
 */

/**
 * @typedef {Object} ChallengesResponse
 * @property {Challenge[]} challenges
 */

/**
 * @typedef {Object} ErrorResponse
 * @property {string[]} errorMessages
 */
