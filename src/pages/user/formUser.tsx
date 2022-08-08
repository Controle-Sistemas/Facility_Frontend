import { CadUserForm } from "../../components/LoginAndCadastroForm/CadUserForm";
import { LoginUserForm } from "../../components/LoginAndCadastroForm/LoginUserForm";
import BackgroundImage from '../../assets/Background.svg';
import '../styles/loginUser.css';

//Pagina de Login e Cadastro de Usuário

export function PageFormUser() {
    return (
        <div className="container-login" >
            <div className="content-login first-content">
                <LoginUserForm />
            </div>
            <div className="content-login second-content">
                <CadUserForm />
            </div>
        </div>

        
    )
}
        