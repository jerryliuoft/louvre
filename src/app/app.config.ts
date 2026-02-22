import { ApplicationConfig, provideZoneChangeDetection, isDevMode } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideServiceWorker } from '@angular/service-worker';

// MAYBE I CAN USE THIS IN THE FUTURE,
// but right now the amount of work even with this implementation is the same,
// and this is tucked away so readability is bad so not using it.
// This is used to fix route not refreshing when only query param changed
// class CustomReuseStrategy extends BaseRouteReuseStrategy {
//   public override shouldReuseRoute(
//     future: ActivatedRouteSnapshot,
//     curr: ActivatedRouteSnapshot
//   ): boolean {
//     return false;
//   }
// }
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAnimationsAsync(),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
};
