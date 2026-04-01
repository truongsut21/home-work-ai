type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogMeta {
  [key: string]: unknown;
}

class Logger {
  private context: LogMeta;

  constructor(context: LogMeta = {}) {
    this.context = context;
  }

  child(meta: LogMeta): Logger {
    return new Logger({ ...this.context, ...meta });
  }

  private log(level: LogLevel, message: string, meta?: LogMeta): void {
    const entry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...this.context,
      ...meta,
    };

    switch (level) {
      case 'error':
        // eslint-disable-next-line no-console
        console.error(JSON.stringify(entry));
        break;
      case 'warn':
        // eslint-disable-next-line no-console
        console.warn(JSON.stringify(entry));
        break;
      case 'debug':
        // eslint-disable-next-line no-console
        console.debug(JSON.stringify(entry));
        break;
      default:
        // eslint-disable-next-line no-console
        console.info(JSON.stringify(entry));
    }
  }

  info(message: string, meta?: LogMeta): void {
    this.log('info', message, meta);
  }

  warn(message: string, meta?: LogMeta): void {
    this.log('warn', message, meta);
  }

  error(message: string, meta?: LogMeta): void {
    this.log('error', message, meta);
  }

  debug(message: string, meta?: LogMeta): void {
    this.log('debug', message, meta);
  }
}

export const logger = new Logger({ app: 'home-work-ai' });
