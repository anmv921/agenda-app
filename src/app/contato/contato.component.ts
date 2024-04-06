import { Component, OnInit } from '@angular/core';
import { Contato } from './contato';
import { ContatoService } from '../contato.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


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

  submit() {
    this.boolCriacaoContactoOK = false;
    if (this.formularioFG.valid) {
      const formValues = this.formularioFG.value;
      const contato: Contato = new Contato(formValues.nome, formValues.email);
      this.contatoService.save(contato).subscribe({ 
        next: respostaContato => {
          this.arr_contatos.push(respostaContato);
          this.listarContatos();
          this.boolCriacaoContactoOK = true;
        },
        error: err => {
          alert(err);
        }
      }); // End of subscribe
    } // End if valid
  } // End submit

} // End class ContatoComponent
