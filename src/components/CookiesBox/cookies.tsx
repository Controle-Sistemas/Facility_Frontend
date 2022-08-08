import Cookies from 'js-cookie';
import { useState } from 'react';
import Modal from 'react-modal'
import {PrimaryButton} from '../styledComponents/buttons';
import {CookieForm,CookieContainer,CookieLink,CookieText,CookieTitle,CookieHeader,CookieButton} from './styled'

const CookieComponent = (props) => {

    const [CookiesState, setCookiesOpen] = useState(true);

    function closeModalCookie() {
        setCookiesOpen(false);
    }


    function handleAccept() {
        Cookies.set('cookies', 'true');
    }

    function handleSubmit(e) {
        e.preventDefault();
        closeModalCookie();

    }

    if (Cookies.get('cookies') === undefined) {
        return (
            <Modal
                isOpen={CookiesState}
                onRequestClose={closeModalCookie}
                ariaHideApp={false}
                overlayClassName="overlay"
                className="modal-cookies" >

                <CookieContainer>
                    <CookieHeader>
                        <CookieTitle>Nós utilizamos Cookies</CookieTitle>
                        <button className="btn-close close" onClick={closeModalCookie}></button>
                    </CookieHeader>
                    <CookieText>
                            Eles são usados para aprimorar a sua experiência. Ao fechar este banner ou continuar na página, você concorda com o uso de cookies.
                            <CookieLink href="https://ufu.br/politica-de-cookies-e-politica-de-privacidade" target="_blank" >Saber mais</CookieLink>
                    </CookieText>
                    <CookieForm onSubmit={handleSubmit}>
                        <PrimaryButton width="100%" onClick={handleAccept}>Aceitar</PrimaryButton>
                        <CookieButton className="btn btn-outline-primary">
                            <CookieLink href="https://support.google.com/accounts/answer/61416" target={'_blank'} >
                                Desativar
                            </CookieLink>
                        </CookieButton>

                        
                    </CookieForm>

                </CookieContainer>
            </Modal>
        )
    } else {
        return null;
    }
}

export default CookieComponent;
