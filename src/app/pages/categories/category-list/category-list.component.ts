import { Category } from './../../../models/category.model';
import { CategoryService } from './../category.service';

import { Component, OnInit } from '@angular/core';
import { error } from 'util';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit {

  categories: Category[] = [];

  constructor(private categoriaService: CategoryService) { }

  ngOnInit() {
    this.categoriaService.getAll()
      .subscribe(categories => this.categories = categories,
        (error: string) => {
          return alert('Erro ao carregar a lista=' + error);
        }
      );
  }

  delete(categoria: Category) {
    const mustDelete = confirm('Deseja realmente excluir este item?');
    if (mustDelete) {
    this.categoriaService.delete(categoria)
      .subscribe(
        () =>  this.categories = this.categories.filter(v => v !== categoria),
        () => alert('Erro ao tentar excluir')
      );
    }
  }

}
