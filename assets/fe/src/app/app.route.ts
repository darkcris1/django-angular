import { RootModule } from "@uirouter/angular"
import { AppComponent } from "./app.component"
import { Logout } from "./commons/utils/security.util"

export const APP_ROUTES:  RootModule = {
    initial: '/login',
    states: [
        {
            name: 'app',
            component: AppComponent
        },
        {
            name: 'logout',
            url: '/logout',
            onEnter: Logout
        },
        {
            name: 'dashboard.**',
            url: '/dashboard',
            loadChildren: ()=> import('./components/users/users.module').then(c=> c.UsersModule)
        },
        {
            name: 'public.**',
            url: '/',
            loadChildren: ()=> import('./components/public/public.module').then(c=> c.PublicModule)
        },
    ]
}