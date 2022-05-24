import './style.css'
import NotFoundImage from '../../assets/images/notFound.png'

export default function Page404() {
  return <div className="interfaceContainer errorWrapper">
    <img src={NotFoundImage}/>
    <h1>404</h1>
    <span>We could not find the page you were looking for.</span>
  </div>
}