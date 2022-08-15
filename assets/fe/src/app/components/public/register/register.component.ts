import { Component, OnInit } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { StateService } from '@uirouter/angular';
import { SignupForm } from 'src/app/commons/forms/users.form';
import { AuthService } from 'src/app/commons/services/users/auth.service';
import { ToastService } from 'src/app/commons/services/users/toast.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  Form = new SignupForm()

  constructor(
    public $auth: AuthService,
    public state: StateService,
    public $toast: ToastService,
  ) { }

  ngOnInit(): void {
  }

  handleSubmit(form: SignupForm['form']){
    form.invalid && form.markAllAsTouched()
    if (form.valid){
      this.$auth.signup(this.Form.formDataValue)
      .then(()=> {
        this.state.go('public.login')
        this.$toast.show("Successfully registered")
      })
      .catch((err)=> {
        err.error && this.Form.setFormErrors(err.error)
      })
    }
  }

  handleFileChange(e: any){
    this.Form.form.patchValue({
      photo: e.target.files[0]
    })
  }
}
