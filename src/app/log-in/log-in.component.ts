import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth/data-access/auth.service';
import { Router } from '@angular/router'; // Asegúrate de importar el Router
import { toast } from 'ngx-sonner';
interface FormSingIn {
  email: FormControl<string | null>;
  password: FormControl<string | null>;
}

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [ReactiveFormsModule],
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
    console.log(field)
    return !!(control?.hasError('required') && control.touched);
  }

  hasEmailError(): boolean {
    const control = this.form.get('email');
    return !!(control?.touched && control?.hasError('email'));
  }

  async submit() {
    if (this.form.invalid) return;

    try {
      const { email, password } = this.form.value;

      if (!email || !password) return;

      await this._authService.signIn({ email, password });


      this._router.navigateByUrl('/stock');  // Ahora _router está definido
    } catch (error) {
      toast.error('Ocurrio un error');
    }
  }
}
