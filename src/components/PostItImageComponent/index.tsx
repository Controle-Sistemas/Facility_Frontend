import PDF from '../../assets/pdfIcon.svg'
import Docs from '../../assets/docIcon.svg'
import Excel from '../../assets/excelIcon.svg'
import File from '../../assets/file.svg'
import {Image} from './styled'
interface Props {
    image?: string
    type: number
}

export function ImagePostIt({image, type}:Props) {
  
  const imageType = type === 1 ? PDF : type === 3 ? Docs : type === 5 ? Excel : type === 2 ? image : File
  return (
    <Image>
        {image ? <img src={`https://raw.githubusercontent.com/Controle-Sistemas/PortalClientes/master/backend/temp/uploads/${image}?token=GHSAT0AAAAAABWBKCXQSWVQNDC3KA77UJGAYXCWG7A`} alt="" style={{height:"100%",width:"100%"}}/> : <img src={imageType} alt="" style={{height:"90%",width:"90%"}}/>}
    </Image>
  )
}