import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Category } from './../../../models/category.model';
import { CategoryService } from './../category.service';

import { switchMap } from 'rxjs/operators';
import toastr from 'toastr';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss']
})
export class CategoryFormComponent implements OnInit, AfterContentChecked {

  currentAction: string = '';
  categoryForm: FormGroup;
  pageTitle: string;
  serverErrorMessage: string[] = null;
  submittingForm: boolean = false;
  category: Category = new Category();

  constructor(
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.setCurrentAction();
    this.buildCategoryForm();
    this.loadCategory();
  }

  ngAfterContentChecked() {
    this.setPageTitle();
  }

  submitForm() {
    this.submittingForm = true;
    if (this.currentAction === 'new' ) {
      this.createCategory();
    } else {
      this.updateCategory();
    }
  }

  // Métodos PRIVADOS
  private setCurrentAction() {
    if (this.route.snapshot.url[0].path === 'new') {
      this.currentAction = 'new';
    } else {
      this.currentAction = 'edit';
    }
  }

  private buildCategoryForm() {
    this.categoryForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null]
    });
  }

  private loadCategory() {
    if (this.currentAction === 'edit' ) {
      this.route.paramMap.pipe(
        switchMap(params => this.categoryService.getById(+params.get('id')))
      )
      .subscribe(
        (categoria) => {
          this.category = categoria;
          this.categoryForm.patchValue(categoria);
        },
        (error) => alert('Ocorreu um erro no servidor, tente mais tarde!')
      );
    }
  }

  private setPageTitle() {
    if (this.currentAction === 'new' ) {
      this.pageTitle = 'Cadastro de Nova Categoria';
    } else {
      const categoryName = this.category.name || '';
      this.pageTitle = 'Editando Categoria: ' + categoryName;
    }
  }

  private createCategory() {
    const category: Category = Object.assign(new Category(), this.categoryForm.value);
    this.categoryService.create(category)
      .subscribe(
        categoria => this.actionsForSuccess(categoria),
        error => this.actionsForError(error)
      );
  }

  private updateCategory() {
    const category: Category = Object.assign(new Category(), this.categoryForm.value);
    this.categoryService.update(category)
      .subscribe(
        categoria => this.actionsForSuccess(categoria),
        error => this.actionsForError(error)
      );
  }

  private actionsForSuccess(category: Category) {
    // toastr.options = {
    //   closeButton: true,
    //   debug: false,
    //   newestOnTop: false,
    //   progressBar: false,
    //   positionClass: 'toast-top-right',
    //   preventDuplicates: false,
    //   onclick: null,
    //   showDuration: 300,
    //   hideDuration: 1000,
    //   timeOut: 0,
    //   extendedTimeOut: 0,
    //   showEasing: 'swing',
    //   hideEasing: 'linear',
    //   showMethod: 'fadeIn',
    //   hideMethod: 'fadeOut',
    //   tapToDismiss: false
    // };

    toastr.success('Mensagem', 'Registro salvo com sucesso!');

    this.router.navigateByUrl('categories', {skipLocationChange: true}).then(
      () => this.router.navigate(['categories', category.id, 'edit'])
    );
  }

  private actionsForError(erro) {
    toastr.error('Ocorreu um erro ao processar sua solicitação!');

    this.submittingForm = false;

    if (erro.status === 422) {
      this.serverErrorMessage = JSON.parse(erro._body).errors;
    } else {
      this.serverErrorMessage = ['Falha na comunicação com o servidor. Tente mais tarde!'];
    }
  }

}
