import { SwampApiApplication } from './application';
import { ApplicationConfig } from '@loopback/core';

export { SwampApiApplication };

export async function main(options: ApplicationConfig = {}) {
  const app = new SwampApiApplication(options);
  await app.boot();
  await app.start();


  console.log("SWAMP APIs @ UNIBO up and running")
  console.log("Go to http://localhost:3000/v0/WDmanager")

  return app;
}
