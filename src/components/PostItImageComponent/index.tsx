import PDF from '../../assets/pdfIcon.svg'
import Docs from '../../assets/docIcon.svg'
import Excel from '../../assets/excelIcon.svg'
import File from '../../assets/file.svg'
import {Image} from './styled'
interface Props {
    image?: string;
    type: number;
    route: string;
}

export function ImagePostIt({image, type, route}:Props) {
  
  const imageType = type === 1 ? PDF : type === 3 ? Docs : type === 5 ? Excel : type === 2 ? image : File //verifica o tipo de arquivo e retorna a imagem correta
  return (
    <Image>
        {image ? <img src={`https://uploadcontrolesistemas.s3.sa-east-1.amazonaws.com/${route}/${image}`} alt="" style={{height:"100%",width:"100%"}}/> : <img src={imageType} alt="" style={{height:"90%",width:"90%"}}/>}
    </Image>
  )
}


/*

ARRUMAR APÓS A PUBLICAÇÃO DA API

*/