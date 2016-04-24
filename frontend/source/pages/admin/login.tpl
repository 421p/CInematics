<div class="login-logo">
    <a href="/"><img src="images/kinodromlogo.png" alt="Автомобильный кинотеатр"/></a>
</div>
<h2 class="form-heading">Вход</h2>
<div class="app-cam">
    <form>
        <input type="text" class="text" placeholder="E-mail адресс">
        <input type="password" placeholder="Пароль">
        <div class="submit"><input type="submit" (click)="Login()" value="Login">
            <a [routerLink]="['Main']">MAIN</a>
        </div>
    </form>
</div>
<div class="copy_layout login">
    <p>Copyright &copy; 2016 Mr.ArtemSky & Andrii B. All Rights Reserved | Design by <a href="http://w3layouts.com/" target="_blank">W3layouts</a> </p>
</div>