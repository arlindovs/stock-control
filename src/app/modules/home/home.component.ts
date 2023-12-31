import { MessageService } from 'primeng/api';
import { CookieService } from 'ngx-cookie-service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SignupUserRequest } from 'src/app/models/interfaces/user/SignupUserRequest';
import { AuthRequest } from 'src/app/models/interfaces/user/auth/AuthRequest';
import { UserService } from 'src/app/services/usuario/user.service';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

/**
 * Componente responsável pela página inicial da aplicação.
 */
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  /**
   * Flag que indica se o card de login está visível.
   */
  loginCard = true;

  /**
   * Formulário de login.
   */
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  /**
   * Formulário de cadastro.
   */
  signupForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private cookieService: CookieService,
    private messageService: MessageService,
    private router: Router,
  ) {}

  ngOnInit(): void {}

  /**
   * Método que é chamado quando o formulário de login é submetido.
   * Autentica o usuário e salva o token no cookie.
   */
  onSubmitLoginForm(): void {
    if (this.loginForm.value && this.loginForm.valid) {
      this.userService.authUser(this.loginForm.value as AuthRequest)
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (response) => {
          if (response) {
            this.cookieService.set('token', response?.token);
            // alert('Usuário autenticado com sucesso!');
            this.loginForm.reset();
            this.router.navigate(['/dashboard']);

            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: `Bem vindo de volta ${response?.name}!`,
              life: 2000,
            });
          }
        },
        error: (err) => {
          // alert(`Erro ao autenticar usuário: ${err.error.message}`);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: `Erro ao fazer Login: ${err.error.message}}`,
            life: 2000,
          });
          console.log('Erro ao autenticar usuário: ', err);
        },
      });
    }
  }

  /**
   * Método que é chamado quando o formulário de cadastro é submetido.
   * Cadastra o usuário e exibe uma mensagem de sucesso.
   */
  onSubmitSignupForm(): void {
    if (this.signupForm.value && this.signupForm.valid) {
      this.userService
        .signupUser(this.signupForm.value as SignupUserRequest)
        .pipe(
          takeUntil(this.destroy$)
        )
        .subscribe({
          next: (response) => {
            if (response) {
              // alert('Usuário cadastrado com sucesso!');
              this.signupForm.reset();
              this.loginCard = true;

              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Usuario criado com sucesso!',
                life: 2000,
              });
            }
          },
          error: (err) => {
            // alert(`Erro ao cadastrar usuário: ${err.error.message}`);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: `Erro ao criar usuario: ${err.error.message}`,
              life: 2000,
            });
            console.log('Erro ao cadastrar usuário: ', err);
          },
        });
    }
  }


  /**
   * Lifecycle hook that is called when the component is about to be destroyed.
   * It is used to clean up any resources or subscriptions before the component is removed from the DOM.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
