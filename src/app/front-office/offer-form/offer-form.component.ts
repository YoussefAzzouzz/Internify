import { Component, OnInit } from '@angular/core';
import { OfferService } from "../../services/offer.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-offer-form',
  templateUrl: './offer-form.component.html',
  styleUrls: ['./offer-form.component.css']
})
export class OfferFormComponent {

  offer = {
    title: '',
    description: '',
    category: '',
    datePub: '',
    dateExp: '',
    image: null
  };

  constructor(private offerService: OfferService , private router: Router) {}

  // Handle file change for the image upload
  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.offer.image = event.target.files[0];
    }
  }

  // Submit the offer with the data and image
  onSubmit() {
    this.offerService.addOfferWithImage(this.offer).subscribe(response => {
      this.router.navigate(['/front-office/internships-offers']);
      console.log('Offer added successfully!', response);
    }, error => {
      console.error('Error adding offer', error);
    });
  }

}
