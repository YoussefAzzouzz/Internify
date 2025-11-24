import { Component, OnInit } from '@angular/core';
import { OfferService } from '../../services/offer.service';
import { Offer } from '../../models/offer';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-offer',
  templateUrl: './offer.component.html',
  styleUrls: ['./offer.component.css']
})
export class OfferComponent implements OnInit {
  offers: Offer[] = [];
  searchParams = {
    searchText: '',
    startDate: '',
    endDate: ''
  };
  private searchSubject = new Subject<string>();

  constructor(private offerService: OfferService) {}

  ngOnInit(): void {
    this.loadOffers();

    // Gestion de la recherche en temps réel avec debounce
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(searchText => {
      this.searchOffers(searchText);
    });
  }

  loadOffers() {
    this.offerService.getOffers().subscribe(data => {
      this.offers = data;
    });
  }

  deleteOffer(id: number) {
    this.offerService.deleteOffer(id).subscribe(() => {
      this.loadOffers();
    });
  }

  onSearchInput(event: any) {
    const searchText = event.target.value;
    this.searchSubject.next(searchText);
  }

  searchOffers(title: string) {
    this.offerService.searchOffers(title).subscribe(data => {
      this.offers = data;
    });
  }

}
