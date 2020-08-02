/**
 * Port
 */
process.env.PORT = process.env.PROT || 3000

/**
 * Environment
 */
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

/**
 * Data base config
 */
let DBUrl

if (process.env.NODE_ENV === 'dev') {
  DBUrl = 'mongodb://localhost:27017/personal-notes'
} else {
  DBUrl = process.env.MONGO_URI
}
process.env.URL_DB = DBUrl

/**
 * Token expiration
 */
process.env.TOKEN_EXPIRATION = '48h'

/**
 * Seed
 */
process.env.SEED = process.env.SEED || 'dev-seed'