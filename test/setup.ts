import '../src/utils/module-alias';
import seed from '@test/seed';

(async () => {
  try {
    await seed.executar();
    await seed.finalizar();
  } catch (error) {
    console.log(error);
  }
})();
