import { useEffect, useState } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import { Product } from '../../types/product';
import Breadcrumb from '../Breadcrumbs/Breadcrumb';
import { NavLink, useLocation } from 'react-router-dom';
import ProductForm from '../../pages/ProductForm';


export const ConfirmDeleteModal = ({ isOpen, onCancel, onDelete, text }) => {
  return (
    <div className={`fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center ${isOpen ? 'visible' : 'hidden'}`}>
      <div className="bg-white p-8 rounded-md shadow-md">
        <p className="text-xl text-black font-semibold mb-4">{text ? text : "Are you sure you want to delete this product?"}</p>
        <div className="flex justify-end">
          <button onClick={onCancel} className="mr-4 px-4 py-2 text-black bg-gray-300 hover:bg-gray-400 rounded-md">Cancel</button>
          <button onClick={onDelete} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md">Delete</button>
        </div>
      </div>
    </div>
  );
};


const Products = () => {
  const location = useLocation();
  const { pathname } = location;
  const [productData, setProductData] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState({ isEditProduct: false, product: {} });
  const [searchTerm, setSearchTerm] = useState('');


  useEffect(() => {
    // Fetch product data from the backend
    const fetchProductData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products');
        if (response.ok) {
          const data = await response.json();
          setProductData(data);
        } else {
          throw new Error('Failed to fetch product data');
        }
      } catch (error) {
        console.error('Error fetching product data:', error);
      }
    };

    fetchProductData();
  }, []);

  // Function to handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter products based on search term
  const filteredProducts = productData.filter((product) => {
    return (
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category
        .map((cat) => cat.name.toLowerCase())
        .join(', ')
        .includes(searchTerm.toLowerCase()) ||
      product.price.toString().includes(searchTerm.toLowerCase())
    );
  });


  const handleEditProduct = ((product) => {
    setEditProduct({ ...editProduct, isEditProduct: true, product })
  })

  const handleClearEditProduct = (() => {
    setEditProduct({ isEditProduct: false, product: {} })
  })


  const handleDeleteButtonClick = (productId: string) => {
    setSelectedProductId(productId);
    setIsConfirmModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/products/${selectedProductId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        // Remove the deleted product from the state
        setProductData(prevData => prevData.filter(product => product._id !== selectedProductId));
        setIsConfirmModalOpen(false);
      } else if (response.status === 401) {
        const responseData = await response.json();
        alert(responseData.message || 'Unauthorized! please check if you have correct access right to delete the product');
      } else {
        throw new Error('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Products" />
      <ConfirmDeleteModal
        isOpen={isConfirmModalOpen}
        onCancel={() => setIsConfirmModalOpen(false)}
        onDelete={handleDelete}
      />
      {editProduct.isEditProduct ? <ProductForm product={editProduct.product} handleClearEditProduct={handleClearEditProduct} /> :
        <div className="flex flex-col gap-10">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="py-6 px-4 md:px-6 flex align-center xl:px-7.5">

              <svg
                className="mt-2 mr-1 fill-body hover:fill-primary dark:fill-bodydark dark:hover:fill-primary"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M9.16666 3.33332C5.945 3.33332 3.33332 5.945 3.33332 9.16666C3.33332 12.3883 5.945 15 9.16666 15C12.3883 15 15 12.3883 15 9.16666C15 5.945 12.3883 3.33332 9.16666 3.33332ZM1.66666 9.16666C1.66666 5.02452 5.02452 1.66666 9.16666 1.66666C13.3088 1.66666 16.6667 5.02452 16.6667 9.16666C16.6667 13.3088 13.3088 16.6667 9.16666 16.6667C5.02452 16.6667 1.66666 13.3088 1.66666 9.16666Z"
                  fill=""
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M13.2857 13.2857C13.6112 12.9603 14.1388 12.9603 14.4642 13.2857L18.0892 16.9107C18.4147 17.2362 18.4147 17.7638 18.0892 18.0892C17.7638 18.4147 17.2362 18.4147 16.9107 18.0892L13.2857 14.4642C12.9603 14.1388 12.9603 13.6112 13.2857 13.2857Z"
                  fill=""
                />
              </svg>
              <input
                type="text"
                placeholder="Search products by category, name, price..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="block w-1/2 px-3 py-2 focus:outline-none focus:border-none dark:bg-boxdark dark:text-white rounded-none shadow-none"
              />
              <div className="ml-auto mt-2" >{filteredProducts.length} products</div>
              <NavLink
                to="/addproduct"
                className={`group relative flex items-center ml-6 gap-2.5 rounded-md border py-1 px-4 font-medium text-black dark:text-bodydark1  duration-300 ease-in-out hover:bg-gray dark:hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('addproduct') && 'bg-graydark dark:bg-meta-4'
                  }`}
              >
                Add a Product
              </NavLink>
            </div>

            <div className="grid 2xl:grid-cols-6 grid-cols-4  border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
              <div className="col-span-2 flex items-center">
                <p className="font-medium">Product Name</p>
              </div>
              <div className="col-span-3 hidden items-center sm:flex">
                <p className="font-medium">Category</p>
              </div>
              <div className="col-span-1 flex items-center">
                <p className="font-medium">Price</p>
              </div>
              <div className=" hidden sm:flex col-span-1  items-center">
                <p className="font-medium">Stock</p>
              </div>
              <div className="col-span-1 flex items-center">
                <p className="font-medium">Actions</p>
              </div>
            </div>

            {filteredProducts.length > 0 ? (
              filteredProducts.map((product, key) => (
                <div
                  className="grid 2xl:grid-cols-6 grid-cols-4 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
                  key={key}
                  onDoubleClick={() => handleEditProduct(product)}
                >
                  <div className="col-span-2 flex items-center">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                      <div className="h-12.5 w-10 rounded-md">
                        <img src={product.image} alt="Product" />
                      </div>
                      <p className="text-sm text-black dark:text-white">
                        {product.name}
                      </p>
                    </div>
                  </div>
                  <div className="   col-span-3 hidden items-center sm:flex">
                    <p className="text-sm text-black dark:text-white">
                      {product.category.map((cat) => cat.name).join(', ')}
                    </p>
                  </div>
                  <div className="col-span-1 flex items-center">
                    <p className="text-sm text-black dark:text-white">
                      ₹{product.price}
                    </p>
                  </div>
                  <div className=" hidden sm:flex col-span-1 items-center">
                    <p className={`text-sm ${product.quantity === 0 ? "text-orange-500" : "text-black dark:text-white"}  `}>{product.quantity === 0 ? "Out of stock" : product.quantity + " left"} </p>
                  </div>
                  <div className="col-span-1 flex items-center">

                    <div className="flex items-center space-x-3.5">
                      <button className="hover:text-primary" onClick={() => handleEditProduct(product)} >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                          <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                          <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                        </svg>
                      </button>

                      <button className="hover:text-primary" onClick={() => handleDeleteButtonClick(product._id)}>
                        <svg
                          className="fill-current"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"
                            fill=""
                          />
                          <path
                            d="M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.75942V13.3313C8.35352 13.6688 8.63477 13.9782 9.00039 13.9782C9.33789 13.9782 9.64727 13.6969 9.64727 13.3313V9.75942C9.64727 9.3938 9.33789 9.11255 9.00039 9.11255Z"
                            fill=""
                          />
                          <path
                            d="M11.2502 9.67504C10.8846 9.64692 10.6033 9.90004 10.5752 10.2657L10.4064 12.7407C10.3783 13.0782 10.6314 13.3875 10.9971 13.4157C11.0252 13.4157 11.0252 13.4157 11.0533 13.4157C11.3908 13.4157 11.6721 13.1625 11.6721 12.825L11.8408 10.35C11.8408 9.98442 11.5877 9.70317 11.2502 9.67504Z"
                            fill=""
                          />
                          <path
                            d="M6.72245 9.67504C6.38495 9.70317 6.1037 10.0125 6.13182 10.35L6.3287 12.825C6.35683 13.1625 6.63808 13.4157 6.94745 13.4157C6.97558 13.4157 6.97558 13.4157 7.0037 13.4157C7.3412 13.3875 7.62245 13.0782 7.59433 12.7407L7.39745 10.2657C7.39745 9.90004 7.08808 9.64692 6.72245 9.67504Z"
                            fill=""
                          />
                        </svg>
                      </button>
                    </div>

                  </div>
                </div>
              ))
            ) : (
              <div className="py-4 px-6 text-center text-2xl text-gray-500 dark:text-gray-400">
                No products found
              </div>
            )}
          </div>
        </div>
      }


    </DefaultLayout >

  );
};

export default Products;
