import { Ng2StateDeclaration } from "@uirouter/angular";
import { AppComponent } from "src/app/app.component";
import { LoginRequired } from "src/app/commons/utils/security.util";
import { DashboardComponent } from "./dashboard/dashboard.component";

export const USERS_ROUTES: Ng2StateDeclaration[] = [
    { 
        name: 'dashboard' , 
        url: '/dashboard',
        component: AppComponent,
        onEnter: LoginRequired
    },
]