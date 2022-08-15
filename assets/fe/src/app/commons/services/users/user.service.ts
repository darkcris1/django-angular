import { Injectable, TemplateRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { httpHandler, httpWaiter, objIsEmpty } from 'src/app/commons/utils/helper.util';
import { encodeURL, urlsafe } from 'src/app/commons/utils/http.util';

import { API_USERS, API_USERS_AUTH } from 'src/app/commons/constants/api.constant';
import { StateService } from '@uirouter/core';
import { AuthService } from "./auth.service"
import { Pagination } from '../../models/utils.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from '../../models/users.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient,
    private state: StateService,
    private auth: AuthService,
    private modals: NgbModal,
  ) { 
    this.runAfterUserExists(u=>{
      if (!u.photo) {
        this.user.photo = "/static/images/logo/lineLogo.png"
      }
    })
  }

  locations = [
    "Dakar",
    "Louga",
    "Saint Louis",
    "Touba"
  ]

  CATEGORY = {
    RIDE: 'ride',
    TASK: 'task',
    ALL: 'all', // all is for fetch filter purposes
  }

  TASKER = 'tasker';
  POSTER = 'poster';
  PARTNER = 'merchant';

  #user = {} as User;
  waiter = httpWaiter()

  async fetch() {
    if(this.auth.authenticated && !this.waiter.loading) {
      const [resp,err] = await this.waiter.handle(this.http.get(API_USERS_AUTH).toPromise()) 
      if (!err) {
        this.#user = resp as User;
        this.runAllFunctions(this.#user)
      }
    }
  }

  get user() {
    if(objIsEmpty(this.#user)) {
      this.fetch();
    }
    return this.#user;
  }

  set user(data: User) {
    this.#user = data;
  }

  userPhoto(user?: User ) {
    return user?.photo || '/static/images/logo/lineLogo.png'
  }

  // Forgot password
  forgotPassword(data: any) {
    return this.http.post(
      urlsafe(API_USERS,'forgot-password'),data
    ).toPromise()
  }
  resetPassword(data: any) {
    return this.http.put(
      urlsafe(API_USERS,'reset-password'),data
    ).toPromise()
  }
  forgotPasswordQ = httpHandler<null>({
    initialData: null,
    handler: (state)=>{
      return async (data: any)=>{
        const [res,err] = await state.handle(this.forgotPassword(data))
      }
    }
  })
  resetPasswordQ = httpHandler<null>({
    initialData: null,
    handler: (state)=>{
      return async (data: any)=>{
        const [res,err] = await state.handle(this.resetPassword(data))
      }
    }
  })

  // Helper
  #runFunctions: any[] = []

  private runAllFunctions(user: User): void {
    this.#runFunctions.forEach((fn: any)=> fn(user));
  }

  runAfterUserExists(...arr: [(u: User)=>void]){
    this.user
    arr.forEach((fn)=> {
      if (!objIsEmpty(this.#user))return fn(this.#user)

      this.#runFunctions.push(fn)
    })
  }
}
