import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DemandService } from '../../services/demand.service';
import * as L from 'leaflet';

@Component({
  selector: 'app-demand-form',
  templateUrl: './demand-form.component.html',
  styleUrls: ['./demand-form.component.css']
})
export class DemandFormComponent implements OnInit, AfterViewInit {
  demandForm: FormGroup;
  isEditMode: boolean = false;
  demandId: number | null = null;
  map!: L.Map;
  marker!: L.Marker;
  isMapInitialized: boolean = false; // Flag to track map initialization
  selectedCv: File | null = null;  // Track the CV file

  constructor(
    private fb: FormBuilder,
    private demandService: DemandService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.demandForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]],
      field: ['', [Validators.required]],
      status: ['', [Validators.required, Validators.pattern('^(Pending|Approved|Rejected)$')]],
      latitude: ['', [Validators.required]],
      longitude: ['', [Validators.required]],
      cv: [null]  // New control to hold the CV file
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.demandId = +id;
        this.loadDemand(this.demandId);
      } else {
        this.initMap(36.8065, 10.1815); // Default location for new demand
      }
    });
  }

  ngAfterViewInit(): void {
    if (!this.isEditMode) {
      this.initMap(36.8065, 10.1815); // Initialize map only if adding a new demand
    }
  }

  private initMap(lat: number, lng: number) {
    if (this.isMapInitialized) return; // Prevent duplicate map initialization
    this.isMapInitialized = true;

    const blackIcon = L.icon({
      iconUrl: 'https://www.svgrepo.com/show/376955/map-marker.svg',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    this.map = L.map('map').setView([lat, lng], 10);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    this.marker = L.marker([lat, lng], {
      icon: blackIcon,
      draggable: true
    }).addTo(this.map);

    this.marker.on('dragend', (event: any) => {
      const position = event.target.getLatLng();
      this.demandForm.patchValue({
        latitude: position.lat,
        longitude: position.lng
      });
    });
  }

  private loadDemand(id: number): void {
    this.demandService.getDemandById(id).subscribe(demand => {
      this.demandForm.patchValue(demand);

      const lat = demand.latitude || 36.8065;
      const lng = demand.longitude || 10.1815;

      if (this.isMapInitialized) {
        this.marker.setLatLng([lat, lng]);
        this.map.setView([lat, lng], 10);
      } else {
        this.initMap(lat, lng);
      }
    });
  }

  // Handle CV file change
  onCvFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedCv = file;
    }
  }

  onSubmit(): void {
    if (this.isEditMode) {
      // Update demand
      this.demandService.updateDemand(this.demandId!, this.demandForm.value, this.selectedCv).subscribe(() => {
        this.navigateToDemandList();
      });
    } else {
      // Create new demand
      this.demandService.createDemand(this.demandForm.value, this.selectedCv).subscribe(() => {
        this.navigateToDemandList();
      });
    }
  }

  private navigateToDemandList(): void {
    const currentUrl = this.router.url;
    if (currentUrl.includes('/front-office')) {
      this.router.navigate(['/front-office/demand']);
    } else {
      this.router.navigate(['/back-office/demand']);
    }
  }
}
