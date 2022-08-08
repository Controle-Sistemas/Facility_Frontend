
import {ErrorTitle,ErrorMessage,ErrorPageContainer} from './styled'


interface Props {
    errorMessage: string;
    dark?: boolean;
}

export function ErrorPage({ errorMessage,dark }:Props) {
    return (

            <ErrorPageContainer>
                <ErrorTitle>
                        <i className="fas fa-exclamation-triangle"></i>
                        ERRO!
                    </ErrorTitle>
                    <ErrorMessage dark={dark}>
                        {errorMessage}
                    </ErrorMessage>
            </ErrorPageContainer>
    );
}