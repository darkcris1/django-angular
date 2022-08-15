import { Component, OnInit } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { StateService } from '@uirouter/angular';
import { SignupForm } from "src/app/commons/forms/users.form"
import { AuthService } from 'src/app/commons/services/users/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  Form = new SignupForm()

  es = false;
  constructor(
    public auth: AuthService,
    public trans: TranslocoService,
    public state: StateService,
  ) { }

  ngOnInit(): void {
  }


  handleSubmit(form: SignupForm['form']){
    form.invalid && form.markAllAsTouched()
  
    if (form.valid){
      this.auth.login(this.Form.formDataValue)
      .then(()=> {
        this.state.go('dashboard')
      })
      .catch((err)=>err.error && this.Form.setFormErrors(err.error) )
    }
  }

  handleFileChange(e: any){
    this.Form.form.patchValue({
      photo: e.target.files[0]
    })
  }
}
