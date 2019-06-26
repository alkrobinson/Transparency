import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));


const x = document.cookie;
// if cookies are shown then do not warn
if (x !== '') {
  // Check for javascript
  document.getElementById('warn').setAttribute('hidden', 'hidden');
}


