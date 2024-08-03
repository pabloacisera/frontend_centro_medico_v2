import { Routes } from '@angular/router';
import { RegistroComponent } from './page/registro/registro.component';
import { LogeoComponent } from './page/logeo/logeo.component';
import { HomeComponent } from './page/home/home.component';
import { DashboardProfesionalComponent } from './page/dashboard-profesional/dashboard-profesional.component';
import { protectedRouteGuard } from './protected-route.guard';
import { Component } from '@angular/core';
import { NuevaFichaComponent } from './page/dashboard-profesional/nueva-ficha/nueva-ficha.component';
import { BuscarNomenclaturaComponent } from './page/dashboard-profesional/buscar-nomenclatura/buscar-nomenclatura.component';
import { CargarResultadosComponent } from './page/dashboard-profesional/cargar-resultados/cargar-resultados.component';
import { PerfilComponent } from './page/dashboard-profesional/perfil/perfil.component';
import { ListadoPacientesComponent } from './page/dashboard-profesional/listado-pacientes/listado-pacientes.component';
import { NuevaIndicacionComponent } from './page/dashboard-profesional/perfil/nueva-indicacion/nueva-indicacion.component';
import { VerComponent } from './page/dashboard-profesional/listado-pacientes/ver/ver.component';
import { EditarComponent } from './page/dashboard-profesional/listado-pacientes/editar/editar.component';
import { CargarComponent } from './page/dashboard-profesional/listado-pacientes/cargar/cargar.component';
import { AutenticacionPacientesComponent } from './page/page-pacientes/login/autenticacion-pacientes/autenticacion-pacientes.component';
import { DashboardPacComponent } from './page/page-pacientes/dashboard-pacientes/dashboard-pac/dashboard-pac.component';
import { LogearAdminComponent } from './page/page-administrativos/logeo-admin/logear/logear.component';
import { DashboardAdminComponent } from './page/page-administrativos/dashboard-admin/dashboard-admin.component';
import { authGuardAdmin } from './page/page-administrativos/logeo-admin/logear/auth.logear-admin.guard';
import { NuevoPacienteComponent } from './page/page-administrativos/nuevo-paciente/nuevo-paciente.component';
import { SistemaTurnosComponent } from './page/sistema-turnos/sistema-turnos.component';
import { TestComponentComponent } from './test-component/test-component.component';
import { ResetearContraseñaComponent } from './page/resetar-contraseña/resetar-contraseña.component';
import { NuevaContraseñaComponent } from './page/resetar-contraseña/nueva-contraseña/nueva-contraseña.component';
import { NuevaContraseñaAdminComponent } from './page/page-administrativos/resetar-contraseña/nueva-contraseña/nueva-contraseña.component';
import { ResetearContraseñaAdminComponent } from './page/page-administrativos/resetar-contraseña/resetar-contraseña.component';
import { CorreosComponent } from './page/correos/correos.component';
import { UploadFileComponent } from './page/page-administrativos/upload-file/upload-file.component';
import { ArchivosComponent } from './page/dashboard-profesional/listado-pacientes/archivos/archivos.component';
import { ImapflowBandejaCorreosComponent } from './page/imapflow-bandeja-correos/imapflow-bandeja-correos.component';
import { ChatWebsocketComponent } from './components/chat-websocket/chat-websocket.component';
import { VerTurnosComponent } from './page/ver-turnos/ver-turnos.component';

export const routes: Routes = [

    /**paginas publicas */
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'registro', component: RegistroComponent },
    { path: 'logear', component: LogeoComponent },
    { path: 'reset-password', component: ResetearContraseñaComponent},
    { path: 'new-password', component: NuevaContraseñaComponent},
    { path: 'reset-password-admin', component: ResetearContraseñaAdminComponent},
    { path: 'new-password-admin', component: NuevaContraseñaAdminComponent},

    /**paginas de profesionales */
    { path: 'dash-prof', canActivate: [protectedRouteGuard], component: DashboardProfesionalComponent },
    { path: 'listado-pacientes', canActivate: [protectedRouteGuard], component: ListadoPacientesComponent },
    { path: 'nueva-ficha', canActivate: [protectedRouteGuard], component: NuevaFichaComponent },
    { path: 'buscar-nomenclatura', canActivate: [protectedRouteGuard], component: BuscarNomenclaturaComponent },
    { path: 'cargar-resultados', canActivate: [protectedRouteGuard], component: CargarResultadosComponent },
    { path: 'perfil', canActivate: [protectedRouteGuard], component: PerfilComponent },
    { path: 'nueva-indicac', canActivate: [protectedRouteGuard], component: NuevaIndicacionComponent },
    { path: 'enviar-correo', canActivate: [protectedRouteGuard], component: CorreosComponent},
    { path:'docs/:id', canActivate: [protectedRouteGuard], component: ArchivosComponent},
    { path: 'ver-turnos', canActivate: [protectedRouteGuard], component: VerTurnosComponent},

    /*paginas de pacientes*/
    { path: 'ver/:id', canActivate: [protectedRouteGuard], component: VerComponent },
    { path: 'editar/:id', canActivate: [protectedRouteGuard], component: EditarComponent },
    { path: 'cargar/:id', canActivate: [protectedRouteGuard], component: CargarComponent },

    /**accesos de pacientes */
    { path: 'logear-paciente', component: AutenticacionPacientesComponent },
    { path: 'dashboard-paciente', canActivate: [protectedRouteGuard], component: DashboardPacComponent },

    /**paginas de administrativos */
    { path: 'logear-admin', component: LogearAdminComponent },
    { path: 'dashboard-admin', canActivate: [authGuardAdmin], component: DashboardAdminComponent },
    { path: 'admin-nuevo-pac', canActivate: [authGuardAdmin], component: NuevoPacienteComponent },
    { path: 'admin-turno', canActivate: [authGuardAdmin], component: SistemaTurnosComponent },
    { path: 'upload-file', canActivate: [authGuardAdmin], component: UploadFileComponent},
    { path: 'bandeja-correo', canActivate: [authGuardAdmin], component: ImapflowBandejaCorreosComponent},

    /**ruta de testeo */
    { path: 'test', component: TestComponentComponent },

    /**ruta de chat */
    { path: 'chat', canActivate: [protectedRouteGuard], component: ChatWebsocketComponent},  
    /** Ruta de redirección para rutas desconocidas */
    { path: '**', redirectTo: '/home' }
];
