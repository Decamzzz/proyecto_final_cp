import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActualizacionUserService {

  private apiUrl = "https://localhost:7104/api/Users";

  constructor(private http: HttpClient) { }

  actualizarUsuario(datos: any): Observable<any> {
    // Limpiar datos antes de enviar - remover campos undefined o vacíos
    const datosLimpios = this.limpiarDatosActualizacion(datos);
    console.log('Datos limpios para actualizar:', datosLimpios);
    
    return this.http.put(`${this.apiUrl}/actualizar`, datosLimpios);
  }

  private limpiarDatosActualizacion(datos: any): any {
    const datosLimpios: any = {
      Id: datos.id,
      ContrasenaActual: datos.contrasenaActual
    };

    // Solo incluir campos que tengan valor
    if (datos.correo && datos.correo.trim() !== '') {
      datosLimpios.Correo = datos.correo;
    }

    if (datos.nuevaContrasena && datos.nuevaContrasena.trim() !== '') {
      datosLimpios.NuevaContrasena = datos.nuevaContrasena;
    }

    if (datos.telefono && datos.telefono.trim() !== '') {
      datosLimpios.Telefono = datos.telefono;
    }

    // Campos opcionales - siempre enviar pero pueden ser string vacío
    datosLimpios.Direccion = datos.direccion || '';
    datosLimpios.Alergias = datos.alergias || '';

    return datosLimpios;
  }
}
