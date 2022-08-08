import BackgroundImage from '../../assets/Background.svg'
import {ErrorTitle,ErrorMessage,ErrorPageContainer} from './styled'


export function NotFound() {
    return (
        <ErrorPageContainer backgroundImage={BackgroundImage}>
            <ErrorTitle>
                <i className="fas fa-exclamation-triangle"></i>
            404
            </ErrorTitle>
            <ErrorMessage>
                A página que você está procurando não existe.

            </ErrorMessage>
        </ErrorPageContainer>
    );
}