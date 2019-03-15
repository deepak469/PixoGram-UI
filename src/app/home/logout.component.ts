import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class LogoutComponent implements OnInit {
  title = 'Logout';

  constructor(private router: Router) { }

  ngOnInit() {
    localStorage.setItem("role", "0");
    localStorage.setItem("jwtToken", "");
    this.router.navigate(['home']);
  }
}
