
import Modal from 'react-modal'
import './styles/modais.css'


function ModalEdit(props) {
  const isMobile = window.innerWidth < 768
  const actualWidth = isMobile ? '90%' : props.width
  const actualHeight = isMobile ? '50vh' : props.height

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

      <div className="header-modal header-modal-edit">
        <h2 className='title'>Preencha os campos</h2>
        <button className="btn-close btn-header" onClick={props.isModalClosed}></button>
      </div>
      <div className="content-modal">
        {props.children}
      </div>
    </Modal>
  )
}

export default ModalEdit