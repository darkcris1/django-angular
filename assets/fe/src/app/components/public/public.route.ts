import { Ng2StateDeclaration, UIView } from "@uirouter/angular";
import { AppComponent } from "src/app/app.component";
import { AlreadyLogin } from "src/app/commons/utils/security.util";
import { LoginComponent } from "./login/login.component"
import { RegisterComponent } from "./register/register.component";

export const PUBLIC_ROUTES: Ng2StateDeclaration[] = [
    {
        name: 'public',
        component: AppComponent
    },
    { 
        name: 'public.login',
        url: '/login?{next:string}',
        component: LoginComponent,
        params: { next: null },
        onEnter: AlreadyLogin
    },
    { 
        name: 'public.register',
        url: '/register',
        component: RegisterComponent,
        onEnter: AlreadyLogin
    }
]