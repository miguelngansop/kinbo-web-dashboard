import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public form: FormGroup;
  loading: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      uname: [null, Validators.compose([Validators.required])],
      password: [null, Validators.compose([Validators.required])]
    });
  }

  onSubmit(value: any) {
    // this.router.navigate(['/dashboards/dashboard1']);
    this.loading = true;
    this.authService.login(value.uname,value.password);
    this.loading = false//.finally(()=> this.loading = false);
  }
}
