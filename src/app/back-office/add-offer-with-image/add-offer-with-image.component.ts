import { Component } from '@angular/core';
import { OfferService } from "../../services/offer.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-offer-with-image',
  templateUrl: './add-offer-with-image.component.html',
  styleUrls: ['./add-offer-with-image.component.css']
})
export class AddOfferWithImageComponent {

  offer = {
    title: '',
    description: '',
    category: '',
    datePub: '',
    dateExp: '',
    experienceMin: 0,
    scoreCvWeight: 0,
    skillsRequired: '',
    image: null
  };

  constructor(private offerService: OfferService, private router: Router) {}

  // Handle file change for the image upload
  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.offer.image = event.target.files[0];
    }
  }

  // Submit the offer with the data and image
  onSubmit() {
    const offerToSend = { ...this.offer, image: null }; // ignore image
    this.offerService.addOffer(offerToSend).subscribe({
      next: (response) => {
        console.log('Offer added successfully!', response);
        this.router.navigate(['/back-office/offer']);
      },
      error: (error) => {
        console.error('Error adding offer', error);
      }
    });
  }
}