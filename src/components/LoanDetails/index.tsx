import './style.css'
import { ModalProps } from '../../types/modal';

export default function LoanDetails({ data, show, onClose }: ModalProps) {
  return <div className="modal" style={{ display: show ? 'flex' : 'none' }}>
    <div className="ldContainer">
      
    </div>
  </div>
}