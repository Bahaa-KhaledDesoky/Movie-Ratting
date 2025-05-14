import { Component, inject, signal } from '@angular/core';
import { PrimaryButtonComponent } from '../primary-button/primary-button.component';
import { CartService } from '../../services/cart.service';
import {RouterLink} from '@angular/router'

@Component({
  selector: 'app-header',
  imports: [PrimaryButtonComponent,RouterLink],
  template: `
    <div class="header">
  <button class="logo" routerLink="/">{{title()}}</button>
  <div class="header-right">
    <app-primary-button [label]="'Cart ('+cartService.cart().length+')'" routerLink="/cart"/>
    
    </div>
</div>
  `,
  styles: `
  
  .header {
  overflow: hidden;
  background-color: #f1f1f1;
  padding: 20px 10px;
}

/* Style the header links */
.header a {
  float: left;
  color: black;
  text-align: center;
  padding: 12px;
  text-decoration: none;
  font-size: 18px;
  line-height: 25px;
  border-radius: 4px;
}

/* Style the logo link (notice that we set the same value of line-height and font-size to prevent the header to increase when the font gets bigger */
.header button.logo {
  font-size: 25px;
  font-weight: bold;
}

/* Change the background color on mouse-over */
.header button:hover {
  background-color: #ddd;
  color: black;
}

/* Style the active/current link*/
.header button.active {
  background-color: dodgerblue;
  color: white;
}

/* Float the link section to the right */
.header-right {
  float: right;
}

/* Add media queries for responsiveness - when the screen is 500px wide or less, stack the links on top of each other */
@media screen and (max-width: 500px) {
  .header button {
    float: none;
    display: block;
    text-align: left;
  }
  .header-right {
    float: none;
  }
}`
})


export class HeaderComponent {

  title = signal("bahaa");
  cartService =inject(CartService);
  onClick(){
    console.log("clicked");
  }
}
