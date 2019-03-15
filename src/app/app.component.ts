import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'PixoGram-UI';

  isNotLoggedIn() {
    if (localStorage.getItem("role") == null || localStorage.getItem("role") == "0") {
      return true;
    }
    else {
      return false;
    }
  }
}
