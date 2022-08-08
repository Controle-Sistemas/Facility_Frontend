import Fab from '@mui/material/Fab';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import {Link} from 'react-router-dom'
import '../styles/solicitacaoEnviada.css'

//Componente da paginha pós solicitação de conta, para caso haja algum problema
function SendSolicitationPage() {


    return (
        <div className="container container-solicitacao">
            <h1>Solicitação enviada com sucesso!</h1>
            <p>
                Agradecemos por sua solicitação.
                <br />
                Aguarde o contato de um de nosso consultores ou,
                caso necessite, entre em contato através de nosso WhatsApp.
            </p>
            <div className="buttons">
                <button className="btn-primary btn-back" onClick={() => window.location.href = '/'}>Voltar para o início</button>
                <a href="https://wa.link/3i5b7x" target="_blank" className="link-whatsapp">
                <Fab color="success" className="whatsapp-btn">
                    <WhatsAppIcon />
                </Fab>
                <p>+55 45 99934-3293</p>

                </a>
                
            </div>
        </div>
    )
}

export default SendSolicitationPage;