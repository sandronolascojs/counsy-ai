import { seedApple } from './billing.seed';

const seed = async () => {
  await seedApple();
};

seed()
  .then(() => {
    console.log('Done');
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
