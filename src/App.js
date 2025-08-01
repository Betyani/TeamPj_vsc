import './App.css';
import BoardList from './board/BoardList';
import BoardRegister from './board/BoardRegister';
import BoardModify from './board/BoardModify';
import ProductList from './product/ProductList';
import ProductModify from './product/ProductModify';
import ProductRegister from './product/ProductRegister';
import ImageUpload from './image/ImageUpload';
import SignUp from './member/SignUp';


function App() {
    return (
        <>
        <ProductRegister />
        <ProductList />
        <ProductModify id={3} />
        <BoardRegister productId={1} />
        <BoardList productId={1} />
        <BoardModify id={1} />
        <ImageUpload />
        <SignUp />
        </>
    );
}
export default App;