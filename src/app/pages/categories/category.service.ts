import { Category } from './../../models/category.model';
import { Injectable } from '@angular/core';
import { Observable, throwError, concat, of, EmptyError, empty } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError, flatMap,  } from 'rxjs/operators';
import { error } from 'util';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiPath = 'http://localhost:3000/categorias';
  categorias: Category[] = [];

  constructor(private http: HttpClient) { }

  getAll(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiPath)
      .pipe(
        map((dados: Category[])  => this.categorias = dados)
      );
    }

  getById(id: number): Observable<Category> {
    return this.http.get(`${this.apiPath}/${id}`)
      .pipe(
        catchError(err => this.errorHandler(err)),
        map(res => res)
      );
  }

  create(categoria: Category): Observable<Category> {
    return this.http.post(`${this.apiPath}`, categoria)
    .pipe(
      catchError(err => this.errorHandler(err)),
      map(res => res)
    );
  }

  update(categoria: Category): Observable<Category> {
    return this.http.put(`${this.apiPath}/${categoria.id}`, categoria)
    .pipe(
      catchError(err => this.errorHandler(err)),
      map(() => categoria)
    );
  }

  delete(categoria: Category): Observable<any> {
    return this.http.delete(`${this.apiPath}/${categoria.id}`)
    .pipe(
      catchError(err => this.errorHandler(err)),
      map(() => null)
    );
  }

  private errorHandler(erro): Observable<any> {
    console.log('Erro encontrado=', erro);
    return throwError(erro);
  }

}
