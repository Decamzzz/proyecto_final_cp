import { ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes'; 

export const appConfig: ApplicationConfig = {
    providers: [
        provideAnimationsAsync(),
        provideRouter(routes),
        provideZoneChangeDetection({eventCoalescing:true}),
        providePrimeNG({
            theme: {
                preset: Aura
            }
        })
    ]
};
