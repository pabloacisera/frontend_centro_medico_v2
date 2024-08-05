import { ApplicationConfig, CUSTOM_ELEMENTS_SCHEMA, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { tokenInterceptorInterceptor } from './token-interceptor.interceptor';
import { SharedModule } from './page/dashboard-profesional/listado-pacientes/shared.module';


import { provideToastr, ToastrModule } from 'ngx-toastr';
import { DateFormatPipe } from './date-format.pipe';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';

const socketIoConfig: SocketIoConfig = { url: 'https://backend-centro-medico-4.onrender.com', options: {} };

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),
    importProvidersFrom(BrowserModule),
    importProvidersFrom(BrowserAnimationsModule),
    importProvidersFrom(ReactiveFormsModule),
    importProvidersFrom(FormsModule),
    importProvidersFrom(HttpClientModule),
    importProvidersFrom(SharedModule),
    importProvidersFrom(DateFormatPipe),
    importProvidersFrom(SocketIoModule.forRoot(socketIoConfig)),
    provideAnimations(),
    provideToastr({
      timeOut:5000,
      preventDuplicates:true,
      positionClass: 'toast-botton-right'
    }),
    provideHttpClient(withInterceptors([tokenInterceptorInterceptor])),
  ]
};
