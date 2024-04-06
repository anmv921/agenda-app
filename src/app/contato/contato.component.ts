import { Component, OnInit } from '@angular/core';
import { Contato } from './contato';
import { ContatoService } from '../contato.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-contato',
  templateUrl: './contato.component.html',
  styleUrl: './contato.component.css'
})
export class ContatoComponent implements OnInit {

  formularioFG!: FormGroup;
  arr_contatos: Contato[] = [];
  arr_colunas = ['id', 'nome', 'email', 'favorito'];
  boolCriacaoContactoOK: boolean = false;

  constructor(
    private contatoService: ContatoService,
    private formBuilder: FormBuilder
  ) {  }

  ngOnInit(): void {
    this.montarFormulario();
    this.listarContatos();
    this.boolCriacaoContactoOK = false;
  } // End ngOnInit

  montarFormulario() {
    this.formularioFG = this.formBuilder.group({
      nome: [ '', Validators.required ],
      email: [ '', [ Validators.required, Validators.email ]]
    });
  }

  listarContatos() {
    this.contatoService.list().subscribe(responseContatos => {
      this.arr_contatos = responseContatos;
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

} // End class ContatoComponent
