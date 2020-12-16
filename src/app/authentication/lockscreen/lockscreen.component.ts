import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {User} from '../../models/user';
import {AuthService} from '../../services/auth.service';
import {CURRENT_USER} from '../../helpers/global-constants';

@Component({
  selector: 'app-lockscreen',
  templateUrl: './lockscreen.component.html',
  styleUrls: ['./lockscreen.component.scss']
})
export class LockscreenComponent implements OnInit {
  public form: FormGroup;
  user: User;
  loading: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.user = JSON.parse(localStorage.getItem(CURRENT_USER));
  }

  ngOnInit() {
    this.form = this.fb.group({
      password: [null, Validators.compose([Validators.required])]
    });
  }

  onSubmit(value: any) {
    // this.router.navigate(['/dashboards/dashboard1']);
    this.loading = true;
    this.authService.login(this.user.userLogin, value.password);
    this.loading = false//.finally(() => this.loading = false);
  }
}
