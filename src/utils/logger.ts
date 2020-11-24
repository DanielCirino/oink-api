import pino from 'pino';

export default pino({
  enabled: Boolean(process.env.LOGGER_ENEBLED),
  level: process.env.LOGGER_LEVEL,
});
