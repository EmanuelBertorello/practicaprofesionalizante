import { FormGroup } from '@angular/forms';

export const isRequired = (field: 'email' | 'password', form: FormGroup) => {
  const control = form.get(field);

  return control && control.touched && control.hasError('required');
};

//