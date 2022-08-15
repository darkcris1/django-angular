import { Transition } from '@uirouter/core';
import { AuthService } from 'src/app/commons/services/users/auth.service';
import { ToastService } from '../services/users/toast.service';
import { UserService } from '../services/users/user.service';



const useServices = (t: Transition)=>{
  return { 
      auth: t.injector().get(AuthService) as AuthService, 
      state: t.router.stateService,
      user: t.injector().get(UserService) as UserService, 
      toast: t.injector().get(ToastService) as ToastService, 
    };
}

export const LoginRequired = (t: any): any => {
  const {auth, state} = useServices(t);
  const to = t.to()
  const href = state.href(to,to.params)
  if(!auth.authenticated) return state.target('public.login',{ next: location.origin + href });
}


export const Logout = (t: any) => {
  const {auth, state} = useServices(t);

  if(auth.authenticated) auth.logout();
  (window as Window).location.href = '/login';
  // refresh the page to reset
  // all temporary storage values
}


export const AlreadyLogin = (t: Transition): any =>{
  const { auth, state, toast } = useServices(t);
  if (auth.authenticated) {
    toast.show("You are already logged in")
    return state.target("dashboard")
  }
}