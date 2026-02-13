import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ProductService } from './product.service';
import { AsyncPipe, CommonModule, NgFor, NgForOf, NgIf } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-product-card-component',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
  imports: [NgFor, NgForOf, CommonModule],
  standalone: true,
})
export class ProductCardComponent implements OnInit {
  products$!: Observable<any>;
  products: any[] = [];
  constructor(public productApi: ProductService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    // this.products$ = this.productApi.getProducts();


    this.productApi.getProducts().subscribe((data) => {
      this.products = data;
      this.cd.detectChanges();
      console.log('apidat', data);
      //   console.log('this.products', this.products.length);
    });
  }
}
