import { Component, OnInit } from '@angular/core';
import { Contato } from './contato';
import { ContatoService } from '../contato.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ContatoDetalheComponent } from '../contato-detalhe/contato-detalhe.component';
import { DOCUMENT } from '@angular/common';


@Component({
  selector: 'app-contato',
  templateUrl: './contato.component.html',
  styleUrl: './contato.component.css'
}) 
export class ContatoComponent implements OnInit {

  formularioFG!: FormGroup;
  arr_contatos: Contato[] = [];
  arr_colunas = ['foto', 'id', 'nome', 'email', 'favorito'];
  boolCriacaoContactoOK: boolean = false;
  totalElementos = 0;
  pagina = 0;
  tamanho = 2;
  pageSizeOptions: number[] = [2, 5, 10, 25, 100];
  boolMostrarAvisoNome: boolean = false;
  boolMostrarAvisoEmailObrigatorio = false;

  constructor(
    private contatoService: ContatoService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.montarFormulario();
    this.listarContatos( this.pagina, this.tamanho );
    this.boolCriacaoContactoOK = false;


  } // End ngOnInit

  montarFormulario() {
    this.formularioFG = this.formBuilder.group({
      nome: [ '', Validators.required ],
      email: [ '', [ Validators.required, Validators.email ]]
    });
  }

  listarContatos(in_pagina: any = 0, in_tamanho: any = 5 ) {
    this.contatoService.list(in_pagina, in_tamanho)
    .subscribe(responsePaginaContato => {
      this.arr_contatos = responsePaginaContato.content;
      this.totalElementos = responsePaginaContato.totalElements;
      this.pagina = responsePaginaContato.number;
    });
  }

  favoritar(in_contato: Contato) {
    this.contatoService.favourite(in_contato)
    .subscribe(
      response => {
        in_contato.favorito = !in_contato.favorito;
      });
  }

  submit() {
    this.boolCriacaoContactoOK = false;

    this.boolMostrarAvisoNome = false;
    if (
      ( this.formularioFG.controls['nome'].errors &&
        this.formularioFG.controls['nome'].errors['required'] )
    ) {
      this.boolMostrarAvisoNome = true;
    }
      
    this.boolMostrarAvisoEmailObrigatorio = false;
    if (
        this.formularioFG.controls['email'].errors &&
        this.formularioFG.controls['email'].errors['required']
    ) {
      this.boolMostrarAvisoEmailObrigatorio = true;
    }


    if (this.formularioFG.valid) {
      const formValues = this.formularioFG.value;
      const contato: Contato = new Contato(formValues.nome, formValues.email);

      this.contatoService.save(contato).subscribe({ 
        next: respostaContato => {
          //this.arr_contatos.push(respostaContato);

          this.boolCriacaoContactoOK = true;

          let arr_temp: Contato[] = [ ...this.arr_contatos, respostaContato];
          this.arr_contatos = arr_temp;
        },
        error: err => {
          alert(err);
        }
      }); // End of subscribe
    } // End if valid
  } // End submit

  uploadFoto(event: any, contato: Contato) {
    const files = event.target.files;

    if (files) {
      const foto = files[0];
      const formData: FormData = new FormData();
      formData.append("foto", foto);
      this.contatoService
        .upload(contato, formData) 
        .subscribe({ next: response => {
            this.listarContatos(this.pagina, this.tamanho);
          },
          error(err) {
            console.log(err);
          },
        }) // End subscribe
    } // End if
  } // End uploadFoto

  visualisarContato( in_contato: Contato ) {
    this.dialog.open( 
      ContatoDetalheComponent, 
      {
        width: '400px',
        height: '450px',
        data: in_contato
      }
    )
  }

  paginar(event: PageEvent) {
    this.pagina = event.pageIndex;
    this.tamanho = event.pageSize;
    this.listarContatos(this.pagina, this.tamanho);
  }

} // End class ContatoComponent
