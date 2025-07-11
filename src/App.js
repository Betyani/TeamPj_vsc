import './App.css';
// import ProductDelete from './prodcut/ProductDelete';
import ProductList from './product/ProductList';
import ProductModify from './product/ProductModify';
import ProductRegister from './product/ProductRegister';

function App() {
    return (
        <>
        <ProductRegister />
        <ProductList />
        <ProductModify id={3} />
        {/* <ProductDelete id={1} /> */}
        </>
    );
}
export default App;