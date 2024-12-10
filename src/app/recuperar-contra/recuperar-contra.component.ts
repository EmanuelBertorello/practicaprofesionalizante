import { Component } from '@angular/core';
import { toast } from 'ngx-sonner';
import { Auth, sendPasswordResetEmail } from '@angular/fire/auth';

@Component({
  selector: 'app-recuperar-contra',
  standalone: true,
  imports: [],
  templateUrl: './recuperar-contra.component.html',
  styleUrls: ['./recuperar-contra.component.css'],
})
export class RecuperarContraComponent {
  constructor(private auth: Auth) {}

  async recuperarContrasena(email: string): Promise<void> {
    try {
      console.log(email)
      await sendPasswordResetEmail(this.auth, email);
      toast.success('Correo para restablecer contraseña enviado');
    } catch (error) {
      toast.error('Error al enviar el correo:' );
      toast.error('Hubo un problema al enviar el correo');
    }
  }

  reset() {
    toast.info('Por favor, ingresa tu correo para continuar');
  }
}
