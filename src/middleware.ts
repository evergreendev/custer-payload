process.on('uncaughtException', err => {
    console.error('Uncaught exception:', err);
  });
  process.on('unhandledRejection', err => {
    console.error('Unhandled rejection:', err);
  });
