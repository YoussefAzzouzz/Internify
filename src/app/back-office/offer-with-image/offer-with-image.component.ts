import { Component } from '@angular/core';
import {OfferService} from "../../services/offer.service";
import {Offer} from "../../models/offer";

@Component({
  selector: 'app-offer-with-image',
  templateUrl: './offer-with-image.component.html',
  styleUrls: ['./offer-with-image.component.css']
})
export class OfferWithImageComponent {
  offers: Offer[] = [];

  constructor(private offerService: OfferService) {}

  ngOnInit(): void {
    this.offerService.getOffers().subscribe((data) => {
      this.offers = data;
    });
  }
}
