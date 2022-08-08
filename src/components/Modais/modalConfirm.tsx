import Modal from 'react-modal'
import './styles/modais.css'
import QuestionIcon from '../../assets/question.svg'


export function ModalConfirm(props) {
  
  const isMobile = window.innerWidth < 768
  const actualWidth = isMobile ? '90%' : props.width
  const actualHeight = isMobile ? '45vh' : props.height

const customStylesModal = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)'
  },
  content: {
    
    width: actualWidth,
    height: actualHeight,
    margin: 'auto',
    border: 'none',
    background: '#fff',
    overflow: 'auto',
    WebkitOverflowScrolling: 'touch',
    borderRadius: '4px',
    outline: 'none',
    padding: '0',
    inset: '0',
    zIndex:"2"

  }
}

  return (
    <Modal
      isOpen={props.isModalOpen}
      onRequestClose={props.isModalClosed}
      style={customStylesModal}
      ariaHideApp={false}
    >

      <div className="header-modal">
        <h2 className='title'>{props.textHeader}</h2>
        <button type="button" className="btn-close btn-header" aria-label="Close" onClick={props.isModalClosed}></button>
      </div>
      <div className="content-modal">
        <div className="content-modal-img">
          <img src={QuestionIcon} alt="" className="img-modal" />

        </div>
        {props.children}
      </div>
    </Modal>
  )
}
