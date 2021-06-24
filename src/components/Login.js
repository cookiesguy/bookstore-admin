import { useLoginUpdate } from '../context/LoginContext';
export default function Login() {
   const login = useLoginUpdate();

   return (
      <div className="dash-board">
         <button onClick={login}>Click to login</button>
      </div>
   );
}
