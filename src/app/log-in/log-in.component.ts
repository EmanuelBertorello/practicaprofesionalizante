import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth/data-access/auth.service';
import { Router } from '@angular/router'; // Asegúrate de importar el Router
import { toast } from 'ngx-sonner';
import { CommonModule } from '@angular/common';
interface FormSingIn {
  email: FormControl<string | null>;
  password: FormControl<string | null>;
}

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './log-in.component.html',
  host: { 'ngSkipHydration': '' }
})
export class LogInComponent {
  private _authService = inject(AuthService);
  private _router = inject(Router);  // Inyectar el Router aquí

  private _formBuilder = inject(FormBuilder);
  form = this._formBuilder.group({
    email: this._formBuilder.control("", [Validators.required, Validators.email]),
    password: this._formBuilder.control("", Validators.required),
  });

  isRequired(field: 'email' | 'password'): boolean {
    const control = this.form.get(field);
 
    return !!(control?.hasError('required') && control.touched);
  }

  hasEmailError(): boolean {
    const control = this.form.get('email');
    return !!(control?.touched && control?.hasError('email'));
  }

  async submit() {
    const email = this.form.value.email ?? ""; // Valor por defecto: cadena vacía
    const password = this.form.value.password ?? ""; // Valor por defecto: cadena vacía
    // Mensajes de error personalizados
    const errors = [];
    if (!email) {
      errors.push("El correo es obligatorio.");
    } else if (this.hasEmailError()) {
      errors.push("El formato del correo es inválido.");
    }
  
    if (!password) {
      errors.push("La contraseña es obligatoria.");
    }
  
    // Mostrar error si hay problemas en los campos
    if (errors.length > 0) {
      toast.error(errors.join(" "));
      return;
    }
  
    try {
      await this._authService.signIn({ email, password });
      this._router.navigateByUrl('/stock');
    }catch (error: any) {
      console.error("Error al iniciar sesión:", error);
  
      if (error?.code === 'auth/invalid-credentials') {
        toast.error("Correo o contraseña incorrectos.");
      } else {
        toast.error("Ocurrió un error inesperado. Inténtalo de nuevo.");
      }
    }
  }
  
  
}
