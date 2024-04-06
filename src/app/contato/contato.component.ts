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

  constructor(
    private contatoService: ContatoService,
    private formBuilder: FormBuilder
  ) {  }


  ngOnInit(): void {
    this.formularioFG = this.formBuilder.group({
      nome: ['', Validators.required],
      email: [ '', [ Validators.required, Validators.email ]
      ]
    });
  } // End ngOnInit

  submit() {

    const formValues = this.formularioFG.value;

    const contato: Contato = new Contato(formValues.nome, formValues.email);

    this.contatoService.save(contato).subscribe( respostaContato => {
      this.arr_contatos.push(respostaContato);
      console.log(this.arr_contatos);
    }); // End save
  } // End submit

} // End class ContatoComponent
