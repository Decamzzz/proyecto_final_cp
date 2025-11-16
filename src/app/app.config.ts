import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom} from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes'; 
import { HttpClientModule } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
    providers: [
        provideAnimationsAsync(),
        provideRouter(routes),
        importProvidersFrom(HttpClientModule), // ¡IMPORTANTE!
        provideZoneChangeDetection({eventCoalescing:true}),
        providePrimeNG({
            theme: {
                preset: Aura
            }
        })
    ]
};
