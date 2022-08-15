import { Component, OnInit, TemplateRef } from '@angular/core';
import { ToastService } from 'src/app/commons/services/users/toast.service';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent implements OnInit {

  constructor(
    public $toast: ToastService
  ) {
  }

  ngOnInit(): void {
      
  }

  isTemplate(toast: any) { return toast.textOrTpl instanceof TemplateRef; }
  isString(toast: any) { return typeof toast.textOrTpl === 'string'; }

  get bottomCenterToasts(){
    return this.$toast.toasts.filter((a)=> a.position === "bottom-center")
  }
  get topRightToasts(){
    return this.$toast.toasts.filter((a)=> !a.position || (a.position === "top-right"))
  }

}